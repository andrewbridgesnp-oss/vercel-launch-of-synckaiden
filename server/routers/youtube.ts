import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as youtubeService from '../services/youtube';

export const youtubeRouter = router({
  // Get channel information
  getChannel: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await youtubeService.getChannelInfo(ctx.user.id);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch channel information');
    }
  }),

  // Get user's videos
  getVideos: protectedProcedure
    .input(z.object({
      maxResults: z.number().min(1).max(50).optional().default(50),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await youtubeService.getVideos(ctx.user.id, input.maxResults);
      } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch videos');
      }
    }),

  // Upload a video
  uploadVideo: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(5000),
      tags: z.array(z.string()).optional(),
      categoryId: z.string().optional(),
      privacyStatus: z.enum(['private', 'public', 'unlisted']),
      scheduledPublishTime: z.string().optional(),
      videoFilePath: z.string(),
      thumbnailPath: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const videoId = await youtubeService.uploadVideo(ctx.user.id, input);
        return { success: true, videoId };
      } catch (error: any) {
        throw new Error(error.message || 'Failed to upload video');
      }
    }),

  // Schedule a video
  scheduleVideo: protectedProcedure
    .input(z.object({
      videoId: z.string(),
      publishTime: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await youtubeService.scheduleVideo(ctx.user.id, input.videoId, input.publishTime);
        return { success: true };
      } catch (error: any) {
        throw new Error(error.message || 'Failed to schedule video');
      }
    }),

  // Get video analytics
  getVideoAnalytics: protectedProcedure
    .input(z.object({
      videoId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await youtubeService.getVideoAnalytics(
          ctx.user.id,
          input.videoId,
          input.startDate,
          input.endDate
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch video analytics');
      }
    }),

  // Get channel analytics
  getChannelAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await youtubeService.getChannelAnalytics(
          ctx.user.id,
          input.startDate,
          input.endDate
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch channel analytics');
      }
    }),

  // Delete a video
  deleteVideo: protectedProcedure
    .input(z.object({
      videoId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await youtubeService.deleteVideo(ctx.user.id, input.videoId);
        return { success: true };
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete video');
      }
    }),

  // Update video metadata
  updateVideo: protectedProcedure
    .input(z.object({
      videoId: z.string(),
      title: z.string().min(1).max(100).optional(),
      description: z.string().max(5000).optional(),
      tags: z.array(z.string()).optional(),
      categoryId: z.string().optional(),
      privacyStatus: z.enum(['private', 'public', 'unlisted']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { videoId, ...updates } = input;
        await youtubeService.updateVideo(ctx.user.id, videoId, updates);
        return { success: true };
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update video');
      }
    }),

  // Stats/Analytics
  getStats: protectedProcedure
    .input(z.object({
      workspaceId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await youtubeService.getStats(ctx.user.id);
      } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch YouTube stats');
      }
    }),
});
