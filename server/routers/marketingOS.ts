import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as marketingService from '../services/marketingOS';

export const marketingOSRouter = router({
  // Campaign Management
  createCampaign: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      description: z.string().max(1000),
      budget: z.number().positive(),
      startDate: z.string(),
      endDate: z.string().optional(),
      targetAudience: z.string(),
      channels: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      return await marketingService.createCampaign({
        userId: ctx.user.id,
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
    }),

  getCampaigns: protectedProcedure
    .query(async ({ ctx }) => {
      return await marketingService.getUserCampaigns(ctx.user.id);
    }),

  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return await marketingService.getCampaignDashboard(ctx.user.id);
    }),

  analyzeCampaign: protectedProcedure
    .input(z.object({
      campaignId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return await marketingService.analyzeCampaignPerformance(input.campaignId, ctx.user.id);
    }),

  // Content Generation
  generateCopy: protectedProcedure
    .input(z.object({
      type: z.enum(['email', 'social', 'ad', 'blog']),
      product: z.string(),
      audience: z.string(),
      tone: z.string(),
      length: z.enum(['short', 'medium', 'long']),
    }))
    .mutation(async ({ input }) => {
      return await marketingService.generateMarketingCopy(input);
    }),

  generateContentIdeas: protectedProcedure
    .input(z.object({
      topic: z.string(),
      audience: z.string(),
      count: z.number().min(1).max(20),
    }))
    .query(async ({ input }) => {
      return await marketingService.generateContentIdeas(input);
    }),

  // Email Campaigns
  createEmailCampaign: protectedProcedure
    .input(z.object({
      campaignId: z.number().optional(),
      subject: z.string().min(1).max(200),
      content: z.string(),
      recipientList: z.string(),
      scheduledFor: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await marketingService.createEmailCampaign({
        userId: ctx.user.id,
        ...input,
        scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
      });
    }),

  getEmailCampaigns: protectedProcedure
    .query(async ({ ctx }) => {
      return await marketingService.getEmailCampaigns(ctx.user.id);
    }),

  // Analytics
  trackEvent: protectedProcedure
    .input(z.object({
      campaignId: z.number(),
      eventType: z.enum(['impression', 'click', 'conversion']),
      value: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      await marketingService.trackCampaignEvent(input);
      return { success: true };
    }),
});
