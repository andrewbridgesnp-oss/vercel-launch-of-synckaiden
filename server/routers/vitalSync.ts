import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as vitalSyncService from '../services/vitalSync';

export const vitalSyncRouter = router({
  getMetrics: protectedProcedure
    .input(z.object({ type: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return await vitalSyncService.getHealthMetrics(ctx.user.id, input.type);
    }),

  recordMetric: protectedProcedure
    .input(z.object({
      type: z.string(),
      value: z.number(),
      unit: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await vitalSyncService.recordHealthMetric({ userId: ctx.user.id, ...input });
    }),

  getAppointments: protectedProcedure
    .query(async ({ ctx }) => {
      return await vitalSyncService.getAppointments(ctx.user.id);
    }),

  scheduleAppointment: protectedProcedure
    .input(z.object({
      providerId: z.number(),
      type: z.string(),
      scheduledAt: z.date(),
      duration: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await vitalSyncService.scheduleAppointment({ userId: ctx.user.id, ...input });
    }),

  getInsights: protectedProcedure
    .query(async ({ ctx }) => {
      return await vitalSyncService.getHealthInsights(ctx.user.id);
    }),
});
