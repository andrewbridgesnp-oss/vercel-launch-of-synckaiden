import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { 
  emailMarketingLists,
  emailMarketingSubscribers,
  emailMarketingCampaigns,
  type InsertEmailMarketingList,
  type InsertEmailMarketingSubscriber,
  type InsertEmailMarketingCampaign
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

export const emailMarketingRouter = router({
  // ============= LISTS =============
  
  getLists: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db
      .select()
      .from(emailMarketingLists)
      .where(eq(emailMarketingLists.userId, ctx.user.id))
      .orderBy(desc(emailMarketingLists.createdAt));
  }),

  createList: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [list] = await db.insert(emailMarketingLists).values({
        userId: ctx.user.id,
        ...input,
      } as InsertEmailMarketingList).$returningId();
      
      return list;
    }),

  updateList: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(emailMarketingLists)
        .set(updates)
        .where(and(
          eq(emailMarketingLists.id, id),
          eq(emailMarketingLists.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteList: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Delete all subscribers first
      await db
        .delete(emailMarketingSubscribers)
        .where(and(
          eq(emailMarketingSubscribers.listId, input.id),
          eq(emailMarketingSubscribers.userId, ctx.user.id)
        ));
      
      await db
        .delete(emailMarketingLists)
        .where(and(
          eq(emailMarketingLists.id, input.id),
          eq(emailMarketingLists.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= SUBSCRIBERS =============
  
  getSubscribers: protectedProcedure
    .input(z.object({
      listId: z.number().int().positive(),
      status: z.enum(["subscribed", "unsubscribed", "bounced", "complained"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(emailMarketingSubscribers)
        .where(and(
          eq(emailMarketingSubscribers.listId, input.listId),
          eq(emailMarketingSubscribers.userId, ctx.user.id)
        ));
      
      if (input.status) {
        query = query.where(eq(emailMarketingSubscribers.status, input.status));
      }
      
      return await query.orderBy(desc(emailMarketingSubscribers.subscribedAt));
    }),

  addSubscriber: protectedProcedure
    .input(z.object({
      listId: z.number().int().positive(),
      email: z.string().email(),
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      tags: z.array(z.string()).optional(),
      customFields: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Check if subscriber already exists
      const existing = await db
        .select()
        .from(emailMarketingSubscribers)
        .where(and(
          eq(emailMarketingSubscribers.listId, input.listId),
          eq(emailMarketingSubscribers.email, input.email),
          eq(emailMarketingSubscribers.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscriber already exists in this list",
        });
      }
      
      const [subscriber] = await db.insert(emailMarketingSubscribers).values({
        userId: ctx.user.id,
        ...input,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        customFields: input.customFields ? JSON.stringify(input.customFields) : null,
      } as InsertEmailMarketingSubscriber).$returningId();
      
      // Update list subscriber count
      await db
        .update(emailMarketingLists)
        .set({ subscriberCount: sql`${emailMarketingLists.subscriberCount} + 1` })
        .where(eq(emailMarketingLists.id, input.listId));
      
      return subscriber;
    }),

  updateSubscriber: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      status: z.enum(["subscribed", "unsubscribed", "bounced", "complained"]).optional(),
      tags: z.array(z.string()).optional(),
      customFields: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates };
      if (updates.tags) updateData.tags = JSON.stringify(updates.tags);
      if (updates.customFields) updateData.customFields = JSON.stringify(updates.customFields);
      if (updates.status === "unsubscribed") updateData.unsubscribedAt = new Date();
      
      await db
        .update(emailMarketingSubscribers)
        .set(updateData)
        .where(and(
          eq(emailMarketingSubscribers.id, id),
          eq(emailMarketingSubscribers.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteSubscriber: protectedProcedure
    .input(z.object({ id: z.number().int().positive(), listId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      await db
        .delete(emailMarketingSubscribers)
        .where(and(
          eq(emailMarketingSubscribers.id, input.id),
          eq(emailMarketingSubscribers.userId, ctx.user.id)
        ));
      
      // Update list subscriber count
      await db
        .update(emailMarketingLists)
        .set({ subscriberCount: sql`${emailMarketingLists.subscriberCount} - 1` })
        .where(eq(emailMarketingLists.id, input.listId));
      
      return { success: true };
    }),

  // ============= CAMPAIGNS =============
  
  getCampaigns: protectedProcedure
    .input(z.object({
      listId: z.number().int().positive().optional(),
      status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(emailMarketingCampaigns)
        .where(eq(emailMarketingCampaigns.userId, ctx.user.id));
      
      if (input.listId) {
        query = query.where(eq(emailMarketingCampaigns.listId, input.listId));
      }
      if (input.status) {
        query = query.where(eq(emailMarketingCampaigns.status, input.status));
      }
      
      return await query.orderBy(desc(emailMarketingCampaigns.createdAt));
    }),

  createCampaign: protectedProcedure
    .input(z.object({
      listId: z.number().int().positive(),
      name: z.string().min(1).max(255),
      subject: z.string().min(1).max(255),
      previewText: z.string().max(255).optional(),
      htmlContent: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [campaign] = await db.insert(emailMarketingCampaigns).values({
        userId: ctx.user.id,
        ...input,
      } as InsertEmailMarketingCampaign).$returningId();
      
      return campaign;
    }),

  updateCampaign: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(255).optional(),
      subject: z.string().min(1).max(255).optional(),
      previewText: z.string().max(255).optional(),
      htmlContent: z.string().min(1).optional(),
      status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]).optional(),
      scheduledAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates };
      if (updates.scheduledAt) updateData.scheduledAt = new Date(updates.scheduledAt);
      
      await db
        .update(emailMarketingCampaigns)
        .set(updateData)
        .where(and(
          eq(emailMarketingCampaigns.id, id),
          eq(emailMarketingCampaigns.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteCampaign: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(emailMarketingCampaigns)
        .where(and(
          eq(emailMarketingCampaigns.id, input.id),
          eq(emailMarketingCampaigns.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= AI SUBJECT LINE GENERATION =============
  
  generateSubjectLine: protectedProcedure
    .input(z.object({
      campaignGoal: z.string(),
      audienceDescription: z.string(),
      emailContent: z.string(),
      tone: z.enum(["professional", "casual", "urgent", "friendly", "promotional"]).default("professional"),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an email marketing expert specializing in high-converting subject lines. Generate 5 compelling subject lines based on the campaign details. Each should be under 60 characters, attention-grabbing, and aligned with the specified tone.`
          },
          {
            role: "user",
            content: `Campaign Goal: ${input.campaignGoal}\nAudience: ${input.audienceDescription}\nTone: ${input.tone}\nEmail Preview: ${input.emailContent.substring(0, 200)}...\n\nGenerate 5 subject lines (one per line):`
          }
        ]
      });
      
      const subjectLines = response.choices[0].message.content
        .trim()
        .split("\n")
        .map(line => line.replace(/^\d+\.\s*/, "").trim())
        .filter(line => line.length > 0);
      
      return { subjectLines };
    }),

  // ============= ANALYTICS =============
  
  getCampaignStats: protectedProcedure
    .input(z.object({ campaignId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      
      const [campaign] = await db
        .select()
        .from(emailMarketingCampaigns)
        .where(and(
          eq(emailMarketingCampaigns.id, input.campaignId),
          eq(emailMarketingCampaigns.userId, ctx.user.id)
        ));
      
      if (!campaign) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Campaign not found" });
      }
      
      const openRate = campaign.sentCount > 0 
        ? (campaign.openCount / campaign.sentCount) * 100 
        : 0;
      const clickRate = campaign.sentCount > 0 
        ? (campaign.clickCount / campaign.sentCount) * 100 
        : 0;
      const bounceRate = campaign.sentCount > 0 
        ? (campaign.bounceCount / campaign.sentCount) * 100 
        : 0;
      
      return {
        ...campaign,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
      };
    }),
});
