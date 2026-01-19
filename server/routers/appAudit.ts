import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { getAllAppsAudit, getAuditSummary } from '../services/appAudit';

export const appAuditRouter = router({
  getAllApps: publicProcedure.query(async () => {
    return await getAllAppsAudit();
  }),

  getSummary: publicProcedure.query(async () => {
    return await getAuditSummary();
  }),

  getByStatus: publicProcedure
    .input(z.object({
      status: z.enum(['Complete', 'Partial', 'Missing']),
    }))
    .query(async ({ input }) => {
      const apps = await getAllAppsAudit();
      return apps.filter(app => app.completionStatus === input.status);
    }),

  getByTier: publicProcedure
    .input(z.object({
      tier: z.enum(['Tier 1', 'Tier 2', 'Tier 3']),
    }))
    .query(async ({ input }) => {
      const apps = await getAllAppsAudit();
      return apps.filter(app => app.roiTier === input.tier);
    }),

  getByCategory: publicProcedure
    .input(z.object({
      category: z.string(),
    }))
    .query(async ({ input }) => {
      const apps = await getAllAppsAudit();
      return apps.filter(app => app.category === input.category);
    }),
});
