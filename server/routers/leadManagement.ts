import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { leadManagementLeads, leadManagementActivities } from "../../drizzle/schema.js";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import { invokeLLM } from "../_core/llm.js";

export const leadManagementRouter = router({
  // ========== LEADS ==========
  
  createLead: protectedProcedure
    .input(z.object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email().max(320),
      phone: z.string().max(20).optional(),
      company: z.string().max(255).optional(),
      title: z.string().max(255).optional(),
      source: z.string().max(100).optional(),
      estimatedValue: z.number().int().min(0).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [lead] = await db.insert(leadManagementLeads).values({
        userId: ctx.user.id,
        ...input,
        score: 50, // Default score
      }).$returningId();
      return lead;
    }),

  getLeads: protectedProcedure
    .input(z.object({
      status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      search: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(leadManagementLeads.userId, ctx.user.id)];
      
      if (input?.status) {
        conditions.push(eq(leadManagementLeads.status, input.status));
      }
      
      if (input?.search) {
        conditions.push(or(
          like(leadManagementLeads.firstName, `%${input.search}%`),
          like(leadManagementLeads.lastName, `%${input.search}%`),
          like(leadManagementLeads.email, `%${input.search}%`),
          like(leadManagementLeads.company, `%${input.search}%`)
        )!);
      }
      
      return await db.select().from(leadManagementLeads)
        .where(and(...conditions))
        .orderBy(desc(leadManagementLeads.score), desc(leadManagementLeads.createdAt))
        .limit(input?.limit || 50);
    }),

  getLead: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [lead] = await db.select().from(leadManagementLeads)
        .where(and(
          eq(leadManagementLeads.id, input.id),
          eq(leadManagementLeads.userId, ctx.user.id)
        ))
        .limit(1);
      return lead;
    }),

  updateLead: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      email: z.string().email().max(320).optional(),
      phone: z.string().max(20).optional(),
      company: z.string().max(255).optional(),
      title: z.string().max(255).optional(),
      source: z.string().max(100).optional(),
      status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
      score: z.number().int().min(0).max(100).optional(),
      estimatedValue: z.number().int().min(0).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      await db.update(leadManagementLeads)
        .set(updates)
        .where(and(
          eq(leadManagementLeads.id, id),
          eq(leadManagementLeads.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteLead: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Delete activities first
      await db.delete(leadManagementActivities)
        .where(eq(leadManagementActivities.leadId, input.id));
      // Delete lead
      await db.delete(leadManagementLeads)
        .where(and(
          eq(leadManagementLeads.id, input.id),
          eq(leadManagementLeads.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== ACTIVITIES ==========

  createActivity: protectedProcedure
    .input(z.object({
      leadId: z.number().int(),
      type: z.enum(["call", "email", "meeting", "note", "task"]),
      subject: z.string().min(1).max(255),
      description: z.string().optional(),
      completedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [activity] = await db.insert(leadManagementActivities).values({
        userId: ctx.user.id,
        ...input,
      }).$returningId();
      return activity;
    }),

  getActivities: protectedProcedure
    .input(z.object({
      leadId: z.number().int(),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return await db.select().from(leadManagementActivities)
        .where(and(
          eq(leadManagementActivities.leadId, input.leadId),
          eq(leadManagementActivities.userId, ctx.user.id)
        ))
        .orderBy(desc(leadManagementActivities.createdAt))
        .limit(input.limit);
    }),

  updateActivity: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      subject: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      completedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      await db.update(leadManagementActivities)
        .set(updates)
        .where(and(
          eq(leadManagementActivities.id, id),
          eq(leadManagementActivities.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteActivity: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(leadManagementActivities)
        .where(and(
          eq(leadManagementActivities.id, input.id),
          eq(leadManagementActivities.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== AI FEATURES ==========

  generateFollowUpEmail: protectedProcedure
    .input(z.object({
      leadId: z.number().int(),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [lead] = await db.select().from(leadManagementLeads)
        .where(and(
          eq(leadManagementLeads.id, input.leadId),
          eq(leadManagementLeads.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!lead) throw new Error("Lead not found");
      
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a professional sales assistant. Generate personalized follow-up emails that are warm, professional, and action-oriented."
          },
          {
            role: "user",
            content: `Generate a follow-up email for this lead:
Name: ${lead.firstName} ${lead.lastName}
Company: ${lead.company || "N/A"}
Title: ${lead.title || "N/A"}
Status: ${lead.status}
${input.context ? `Context: ${input.context}` : ""}

Write a professional follow-up email with subject line and body.`
          }
        ],
      });
      
      return { email: response.choices[0].message.content };
    }),

  // ========== ANALYTICS ==========

  getAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const [stats] = await db.select({
        total: sql<number>`COUNT(*)`,
        new: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'new' THEN 1 ELSE 0 END)`,
        contacted: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'contacted' THEN 1 ELSE 0 END)`,
        qualified: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'qualified' THEN 1 ELSE 0 END)`,
        proposal: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'proposal' THEN 1 ELSE 0 END)`,
        negotiation: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'negotiation' THEN 1 ELSE 0 END)`,
        won: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'won' THEN 1 ELSE 0 END)`,
        lost: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'lost' THEN 1 ELSE 0 END)`,
        totalValue: sql<number>`COALESCE(SUM(${leadManagementLeads.estimatedValue}), 0)`,
        avgScore: sql<number>`COALESCE(AVG(${leadManagementLeads.score}), 0)`,
      }).from(leadManagementLeads)
        .where(eq(leadManagementLeads.userId, ctx.user.id));
      
      return stats;
    }),

  getStats: protectedProcedure
    .input(z.object({
      workspaceId: z.number().optional(),
    }))
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const [stats] = await db.select({
        total: sql<number>`COUNT(*)`,
        qualified: sql<number>`SUM(CASE WHEN ${leadManagementLeads.status} = 'qualified' THEN 1 ELSE 0 END)`,
        conversionRate: sql<number>`COALESCE(SUM(CASE WHEN ${leadManagementLeads.status} IN ('won', 'proposal') THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0)`,
      }).from(leadManagementLeads)
        .where(eq(leadManagementLeads.userId, ctx.user.id));
      
      return {
        totalLeads: stats.total || 0,
        qualifiedLeads: stats.qualified || 0,
        conversionRate: stats.conversionRate || 0,
      };
    }),
});
