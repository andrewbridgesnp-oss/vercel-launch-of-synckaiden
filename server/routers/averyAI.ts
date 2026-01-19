import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as averyService from '../services/averyAI';

export const averyAIRouter = router({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return await averyService.getConversations(ctx.user.id);
  }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      return await averyService.getMessages(input.conversationId);
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string(),
      role: z.enum(['customer', 'ai', 'agent']),
    }))
    .mutation(async ({ input }) => {
      return await averyService.sendMessage(input);
    }),

  generateResponse: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      customerMessage: z.string(),
      conversationHistory: z.array(z.object({
        id: z.number(),
        conversationId: z.number(),
        role: z.enum(['customer', 'ai', 'agent']),
        content: z.string(),
        timestamp: z.date(),
      })),
    }))
    .mutation(async ({ input }) => {
      return await averyService.generateAIResponse(input);
    }),

  escalate: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      return await averyService.escalateToHuman(input.conversationId);
    }),

  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    return await averyService.getAnalytics(ctx.user.id);
  }),
});
