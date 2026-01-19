import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as creativeClashService from '../services/creativeClashLive';

export const creativeClashLiveRouter = router({
  getCompetitions: protectedProcedure.query(async () => {
    return await creativeClashService.getCompetitions();
  }),

  getSubmissions: protectedProcedure
    .input(z.object({ competitionId: z.number() }))
    .query(async ({ input }) => {
      return await creativeClashService.getSubmissions(input.competitionId);
    }),

  submitEntry: protectedProcedure
    .input(z.object({
      competitionId: z.number(),
      title: z.string(),
      fileUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await creativeClashService.submitEntry({ userId: ctx.user.id, ...input });
    }),

  vote: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .mutation(async ({ input }) => {
      return await creativeClashService.voteForSubmission(input.submissionId);
    }),

  getLeaderboard: protectedProcedure.query(async () => {
    return await creativeClashService.getLeaderboard();
  }),

  judgeSubmission: protectedProcedure
    .input(z.object({
      submissionId: z.number(),
      criteria: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      return await creativeClashService.judgeSubmission(input);
    }),
});
