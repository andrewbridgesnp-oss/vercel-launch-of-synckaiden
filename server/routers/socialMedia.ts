import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as socialMediaService from '../services/socialMedia';

export const socialMediaRouter = router({
  // Video Draft Management
  createDraft: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().max(5000),
      videoUrl: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      platforms: z.array(z.enum(['facebook', 'youtube', 'tiktok', 'instagram', 'snapchat'])),
    }))
    .mutation(async ({ ctx, input }) => {
      return await socialMediaService.createVideoDraft({
        userId: ctx.user.id,
        ...input,
      });
    }),

  getDrafts: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'scheduled', 'published']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await socialMediaService.getUserVideoDrafts(ctx.user.id, input.status);
    }),

  approveDraft: protectedProcedure
    .input(z.object({
      draftId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await socialMediaService.approveVideoDraft(input.draftId, ctx.user.id);
      return { success: true };
    }),

  rejectDraft: protectedProcedure
    .input(z.object({
      draftId: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await socialMediaService.rejectVideoDraft(input.draftId, ctx.user.id, input.reason);
      return { success: true };
    }),

  // Scheduling
  scheduleDraft: protectedProcedure
    .input(z.object({
      draftId: z.number(),
      scheduledFor: z.string(), // ISO date string
      platforms: z.array(z.enum(['facebook', 'youtube', 'tiktok', 'instagram', 'snapchat'])),
    }))
    .mutation(async ({ ctx, input }) => {
      const plans = await socialMediaService.scheduleVideoDraft({
        draftId: input.draftId,
        userId: ctx.user.id,
        scheduledFor: new Date(input.scheduledFor),
        platforms: input.platforms,
      });
      return { success: true, plans };
    }),

  getScheduledPosts: protectedProcedure
    .query(async ({ ctx }) => {
      return await socialMediaService.getScheduledPosts(ctx.user.id);
    }),

  // Publishing
  publishPost: protectedProcedure
    .input(z.object({
      postPlanId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await socialMediaService.publishPost(input.postPlanId, ctx.user.id);
    }),

  // Analytics
  getPostAnalytics: protectedProcedure
    .input(z.object({
      postPlanId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return await socialMediaService.getPostAnalytics(input.postPlanId, ctx.user.id);
    }),

  // Trending Topics
  getTrendingTopics: protectedProcedure
    .input(z.object({
      platform: z.enum(['facebook', 'youtube', 'tiktok', 'instagram', 'snapchat']),
    }))
    .query(async ({ input }) => {
      return await socialMediaService.scanTrendingTopics(input.platform);
    }),

  // Affiliate Offers
  getAffiliateOffers: protectedProcedure
    .query(async () => {
      return await socialMediaService.getAffiliateOffers();
    }),

  // Stats/Analytics
  getStats: protectedProcedure
    .input(z.object({
      workspaceId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await socialMediaService.getStats(ctx.user.id);
    }),
});
