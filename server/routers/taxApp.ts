import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as taxService from '../services/taxApp';

export const taxAppRouter = router({
  // Tax Returns
  getTaxReturns: protectedProcedure
    .query(async ({ ctx }) => {
      return await taxService.getUserTaxReturns(ctx.user.id);
    }),

  createTaxReturn: protectedProcedure
    .input(z.object({
      taxYear: z.number().min(2020).max(2030),
      filingStatus: z.enum(['single', 'married_joint', 'married_separate', 'head_of_household']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.createTaxReturn({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Documents
  getDocuments: protectedProcedure
    .input(z.object({
      taxYear: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await taxService.getTaxDocuments(ctx.user.id, input.taxYear);
    }),

  // Tax Calculations
  calculateEstimate: protectedProcedure
    .input(z.object({
      income: z.number().positive(),
      filingStatus: z.string(),
      deductions: z.array(z.object({
        category: z.string(),
        amount: z.number(),
      })).optional(),
      state: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.calculateTaxEstimate({
        userId: ctx.user.id,
        ...input,
      });
    }),

  calculateQuarterlyTaxes: protectedProcedure
    .input(z.object({
      estimatedAnnualIncome: z.number().positive(),
      filingStatus: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.calculateQuarterlyTaxes({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Deductions
  findDeductions: protectedProcedure
    .input(z.object({
      income: z.number().positive(),
      expenses: z.array(z.object({
        category: z.string(),
        amount: z.number(),
        description: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.findEligibleDeductions({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Tax Advice
  getAdvice: protectedProcedure
    .input(z.object({
      question: z.string().min(1).max(1000),
      context: z.object({
        income: z.number().optional(),
        filingStatus: z.string().optional(),
        state: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.getTaxAdvice({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Filing Checklist
  getFilingChecklist: protectedProcedure
    .input(z.object({
      taxYear: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return await taxService.getTaxFilingChecklist(ctx.user.id, input.taxYear);
    }),

  // Tax Savings Analysis
  analyzeSavings: protectedProcedure
    .input(z.object({
      income: z.number().positive(),
      currentDeductions: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await taxService.analyzeTaxSavings({
        userId: ctx.user.id,
        ...input,
      });
    }),
});
