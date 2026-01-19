import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as atlasService from '../services/atlasAcademy';

export const atlasAcademyRouter = router({
  getCourses: protectedProcedure.query(async () => {
    return await atlasService.getCourses();
  }),

  enroll: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await atlasService.enrollInCourse(ctx.user.id, input.courseId);
    }),

  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return await atlasService.getEnrollments(ctx.user.id);
  }),

  updateProgress: protectedProcedure
    .input(z.object({ enrollmentId: z.number(), progress: z.number().min(0).max(100) }))
    .mutation(async ({ input }) => {
      return await atlasService.updateProgress(input.enrollmentId, input.progress);
    }),

  getRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await atlasService.getCourseRecommendations(ctx.user.id);
  }),
});
