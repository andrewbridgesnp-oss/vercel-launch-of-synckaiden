import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as fundingService from '../services/aiFundingBrokerage';

const businessProfileSchema = z.object({
  businessName: z.string(),
  industry: z.string(),
  yearsInBusiness: z.number(),
  annualRevenue: z.number(),
  monthlyRevenue: z.number(),
  employees: z.number(),
  creditScore: z.number(),
  hasCollateral: z.boolean(),
  existingDebt: z.number(),
});

export const aiFundingBrokerageRouter = router({
  getApplications: protectedProcedure.query(async ({ ctx }) => {
    return await fundingService.getUserApplications(ctx.user.id);
  }),

  createApplication: protectedProcedure
    .input(z.object({
      businessName: z.string(),
      industry: z.string(),
      fundingAmount: z.number().positive(),
      fundingPurpose: z.string(),
      creditScore: z.number().min(300).max(850),
      annualRevenue: z.number(),
      yearsInBusiness: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await fundingService.createApplication({ userId: ctx.user.id, ...input });
    }),

  findOptions: protectedProcedure
    .input(z.object({
      fundingAmount: z.number().positive(),
      creditScore: z.number(),
      annualRevenue: z.number(),
      yearsInBusiness: z.number(),
      industry: z.string(),
      fundingPurpose: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await fundingService.findFundingOptions(input);
    }),

  calculateEligibility: protectedProcedure
    .input(businessProfileSchema)
    .mutation(async ({ input }) => {
      return await fundingService.calculateEligibility(input);
    }),

  getAdvice: protectedProcedure
    .input(z.object({
      question: z.string(),
      businessProfile: businessProfileSchema.optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await fundingService.getFundingAdvice({ userId: ctx.user.id, ...input });
    }),

  generateDocuments: protectedProcedure
    .input(z.object({
      businessProfile: businessProfileSchema,
      fundingAmount: z.number().positive(),
      fundingPurpose: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await fundingService.generateApplicationDocuments(input);
    }),

  compareOptions: protectedProcedure
    .input(z.object({
      optionIds: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      return await fundingService.compareFundingOptions(input.optionIds);
    }),
});
