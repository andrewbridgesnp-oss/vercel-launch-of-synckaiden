import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as services from '../services/remainingApps';

// Agent Swarm Router
export const agentSwarmRouter = router({
  getAgents: protectedProcedure.query(async ({ ctx }) => {
    return await services.AgentSwarm.getAgents(ctx.user.id);
  }),

  createTask: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await services.AgentSwarm.createTask(ctx.user.id, input.description);
    }),

  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return await services.AgentSwarm.getTasks(ctx.user.id);
  }),
});

// Pantry Inventory Router
export const pantryInventoryRouter = router({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    return await services.PantryInventory.getItems(ctx.user.id);
  }),

  addItem: protectedProcedure
    .input(z.object({
      name: z.string(),
      category: z.string(),
      quantity: z.number(),
      unit: z.string(),
      expirationDate: z.date().optional(),
      location: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await services.PantryInventory.addItem({ userId: ctx.user.id, ...input });
    }),

  getExpiringItems: protectedProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ ctx, input }) => {
      return await services.PantryInventory.getExpiringItems(ctx.user.id, input.days);
    }),

  generateShoppingList: protectedProcedure.query(async ({ ctx }) => {
    return await services.PantryInventory.generateShoppingList(ctx.user.id);
  }),
});

// Audio Mastering Router
export const audioMasteringRouter = router({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await services.AudioMastering.getProjects(ctx.user.id);
  }),

  createProject: protectedProcedure
    .input(z.object({
      name: z.string(),
      inputFileUrl: z.string(),
      settings: z.object({
        targetLoudness: z.number(),
        compression: z.boolean(),
        eq: z.boolean(),
        stereoWidth: z.number(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      return await services.AudioMastering.createProject({ userId: ctx.user.id, ...input });
    }),

  analyzeAudio: protectedProcedure
    .input(z.object({ fileUrl: z.string() }))
    .mutation(async ({ input }) => {
      return await services.AudioMastering.analyzeAudio(input.fileUrl);
    }),
});

// HealthSync Scribe Router
export const healthSyncScribeRouter = router({
  getTranscriptions: protectedProcedure.query(async ({ ctx }) => {
    return await services.HealthSyncScribe.getTranscriptions(ctx.user.id);
  }),

  createTranscription: protectedProcedure
    .input(z.object({
      patientName: z.string(),
      appointmentDate: z.date(),
      audioFileUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await services.HealthSyncScribe.createTranscription({ userId: ctx.user.id, ...input });
    }),

  generateSummary: protectedProcedure
    .input(z.object({ transcriptText: z.string() }))
    .mutation(async ({ input }) => {
      return await services.HealthSyncScribe.generateMedicalSummary(input.transcriptText);
    }),
});

// SpamSlayer Router
export const spamSlayerRouter = router({
  getFilters: protectedProcedure.query(async ({ ctx }) => {
    return await services.SpamSlayer.getFilters(ctx.user.id);
  }),

  createFilter: protectedProcedure
    .input(z.object({
      name: z.string(),
      criteria: z.string(),
      action: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await services.SpamSlayer.createFilter({ userId: ctx.user.id, ...input });
    }),

  analyzeEmail: protectedProcedure
    .input(z.object({ emailContent: z.string() }))
    .mutation(async ({ input }) => {
      return await services.SpamSlayer.analyzeEmail(input.emailContent);
    }),

  getReport: protectedProcedure.query(async ({ ctx }) => {
    return await services.SpamSlayer.getSpamReport(ctx.user.id);
  }),
});
