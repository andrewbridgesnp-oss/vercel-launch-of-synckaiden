import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as financialService from '../services/financialCoPilot';

export const financialCoPilotRouter = router({
  // Accounts
  getAccounts: protectedProcedure
    .query(async ({ ctx }) => {
      return await financialService.getUserAccounts(ctx.user.id);
    }),

  // Transactions
  getTransactions: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(500).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await financialService.getRecentTransactions(ctx.user.id, input.limit);
    }),

  categorizeTransaction: protectedProcedure
    .input(z.object({
      description: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ input }) => {
      const category = await financialService.categorizeTransaction(input.description, input.amount);
      return { category };
    }),

  // Budgets
  getBudgets: protectedProcedure
    .query(async ({ ctx }) => {
      return await financialService.getUserBudgets(ctx.user.id);
    }),

  createBudget: protectedProcedure
    .input(z.object({
      category: z.string().min(1).max(100),
      amount: z.number().positive(),
      period: z.enum(['weekly', 'monthly', 'yearly']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await financialService.createBudget({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Goals
  getGoals: protectedProcedure
    .query(async ({ ctx }) => {
      return await financialService.getUserGoals(ctx.user.id);
    }),

  createGoal: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      targetAmount: z.number().positive(),
      deadline: z.string(), // ISO date
      category: z.enum(['savings', 'debt_payoff', 'investment', 'purchase', 'emergency_fund']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await financialService.createGoal({
        userId: ctx.user.id,
        name: input.name,
        targetAmount: input.targetAmount,
        deadline: new Date(input.deadline),
        category: input.category,
      });
    }),

  // Analysis
  analyzeCashFlow: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await financialService.analyzeCashFlow(
        ctx.user.id,
        new Date(input.startDate),
        new Date(input.endDate)
      );
    }),

  getInsights: protectedProcedure
    .query(async ({ ctx }) => {
      return await financialService.getFinancialInsights(ctx.user.id);
    }),

  calculateNetWorth: protectedProcedure
    .query(async ({ ctx }) => {
      return await financialService.calculateNetWorth(ctx.user.id);
    }),

  getSpendingTrends: protectedProcedure
    .input(z.object({
      months: z.number().min(1).max(24).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await financialService.getSpendingTrends(ctx.user.id, input.months);
    }),

  // AI Advisor
  getAdvice: protectedProcedure
    .input(z.object({
      question: z.string().min(1).max(1000),
      context: z.object({
        income: z.number().optional(),
        expenses: z.number().optional(),
        goals: z.array(z.string()).optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await financialService.generateFinancialAdvice({
        userId: ctx.user.id,
        question: input.question,
        context: input.context,
      });
    }),
});
