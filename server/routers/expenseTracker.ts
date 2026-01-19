import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { 
  expenseTrackerCategories, 
  expenseTrackerExpenses,
  type InsertExpenseTrackerCategory,
  type InsertExpenseTrackerExpense
} from "../../drizzle/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

export const expenseTrackerRouter = router({
  // ============= CATEGORIES =============
  
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db
      .select()
      .from(expenseTrackerCategories)
      .where(eq(expenseTrackerCategories.userId, ctx.user.id))
      .orderBy(expenseTrackerCategories.name);
  }),

  createCategory: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      icon: z.string().max(50).optional(),
      color: z.string().max(7).optional(),
      budget: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [category] = await db.insert(expenseTrackerCategories).values({
        userId: ctx.user.id,
        ...input,
      } as InsertExpenseTrackerCategory).$returningId();
      
      return category;
    }),

  updateCategory: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(100).optional(),
      icon: z.string().max(50).optional(),
      color: z.string().max(7).optional(),
      budget: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(expenseTrackerCategories)
        .set(updates)
        .where(and(
          eq(expenseTrackerCategories.id, id),
          eq(expenseTrackerCategories.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Check if category has expenses
      const expenses = await db
        .select({ id: expenseTrackerExpenses.id })
        .from(expenseTrackerExpenses)
        .where(and(
          eq(expenseTrackerExpenses.categoryId, input.id),
          eq(expenseTrackerExpenses.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (expenses.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete category with existing expenses",
        });
      }
      
      await db
        .delete(expenseTrackerCategories)
        .where(and(
          eq(expenseTrackerCategories.id, input.id),
          eq(expenseTrackerCategories.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= EXPENSES =============
  
  getExpenses: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      categoryId: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(100).default(50),
      offset: z.number().int().nonnegative().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(expenseTrackerExpenses)
        .where(eq(expenseTrackerExpenses.userId, ctx.user.id));
      
      if (input.startDate) {
        query = query.where(gte(expenseTrackerExpenses.date, new Date(input.startDate)));
      }
      if (input.endDate) {
        query = query.where(lte(expenseTrackerExpenses.date, new Date(input.endDate)));
      }
      if (input.categoryId) {
        query = query.where(eq(expenseTrackerExpenses.categoryId, input.categoryId));
      }
      
      const expenses = await query
        .orderBy(desc(expenseTrackerExpenses.date))
        .limit(input.limit)
        .offset(input.offset);
      
      return expenses;
    }),

  createExpense: protectedProcedure
    .input(z.object({
      categoryId: z.number().int().positive(),
      amount: z.number().int().positive(),
      description: z.string().optional(),
      date: z.string(),
      receiptUrl: z.string().url().optional(),
      merchant: z.string().max(255).optional(),
      paymentMethod: z.string().max(50).optional(),
      tags: z.array(z.string()).optional(),
      isRecurring: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [expense] = await db.insert(expenseTrackerExpenses).values({
        userId: ctx.user.id,
        ...input,
        date: new Date(input.date),
        tags: input.tags ? JSON.stringify(input.tags) : null,
      } as InsertExpenseTrackerExpense).$returningId();
      
      return expense;
    }),

  updateExpense: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      categoryId: z.number().int().positive().optional(),
      amount: z.number().int().positive().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      receiptUrl: z.string().url().optional(),
      merchant: z.string().max(255).optional(),
      paymentMethod: z.string().max(50).optional(),
      tags: z.array(z.string()).optional(),
      isRecurring: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates };
      if (updates.date) {
        updateData.date = new Date(updates.date);
      }
      if (updates.tags) {
        updateData.tags = JSON.stringify(updates.tags);
      }
      
      await db
        .update(expenseTrackerExpenses)
        .set(updateData)
        .where(and(
          eq(expenseTrackerExpenses.id, id),
          eq(expenseTrackerExpenses.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteExpense: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(expenseTrackerExpenses)
        .where(and(
          eq(expenseTrackerExpenses.id, input.id),
          eq(expenseTrackerExpenses.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= AI CATEGORIZATION =============
  
  suggestCategory: protectedProcedure
    .input(z.object({
      description: z.string(),
      merchant: z.string().optional(),
      amount: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Get user's existing categories
      const categories = await db
        .select()
        .from(expenseTrackerCategories)
        .where(eq(expenseTrackerCategories.userId, ctx.user.id));
      
      const categoryList = categories.map(c => c.name).join(", ");
      
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expense categorization assistant. Given a transaction description, merchant, and amount, suggest the most appropriate category from the user's existing categories. If none fit well, suggest a new category name. Respond with just the category name.`
          },
          {
            role: "user",
            content: `Transaction: ${input.description}${input.merchant ? ` at ${input.merchant}` : ""} for $${(input.amount / 100).toFixed(2)}.\n\nExisting categories: ${categoryList || "None"}\n\nSuggest the best category:`
          }
        ]
      });
      
      const suggestedCategory = response.choices[0].message.content.trim();
      
      // Try to find matching existing category
      const matchingCategory = categories.find(c => 
        c.name.toLowerCase() === suggestedCategory.toLowerCase()
      );
      
      return {
        categoryName: suggestedCategory,
        categoryId: matchingCategory?.id,
        isNew: !matchingCategory,
      };
    }),

  // ============= ANALYTICS =============
  
  getSpendingByCategory: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      
      const results = await db
        .select({
          categoryId: expenseTrackerExpenses.categoryId,
          categoryName: expenseTrackerCategories.name,
          totalAmount: sql<number>`SUM(${expenseTrackerExpenses.amount})`,
          count: sql<number>`COUNT(*)`,
        })
        .from(expenseTrackerExpenses)
        .leftJoin(
          expenseTrackerCategories,
          eq(expenseTrackerExpenses.categoryId, expenseTrackerCategories.id)
        )
        .where(and(
          eq(expenseTrackerExpenses.userId, ctx.user.id),
          gte(expenseTrackerExpenses.date, new Date(input.startDate)),
          lte(expenseTrackerExpenses.date, new Date(input.endDate))
        ))
        .groupBy(expenseTrackerExpenses.categoryId, expenseTrackerCategories.name);
      
      return results;
    }),

  getMonthlyTrend: protectedProcedure
    .input(z.object({
      months: z.number().int().positive().max(12).default(6),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      
      const results = await db
        .select({
          month: sql<string>`DATE_FORMAT(${expenseTrackerExpenses.date}, '%Y-%m')`,
          totalAmount: sql<number>`SUM(${expenseTrackerExpenses.amount})`,
          count: sql<number>`COUNT(*)`,
        })
        .from(expenseTrackerExpenses)
        .where(eq(expenseTrackerExpenses.userId, ctx.user.id))
        .groupBy(sql`DATE_FORMAT(${expenseTrackerExpenses.date}, '%Y-%m')`)
        .orderBy(sql`DATE_FORMAT(${expenseTrackerExpenses.date}, '%Y-%m') DESC`)
        .limit(input.months);
      
      return results.reverse();
    }),
});
