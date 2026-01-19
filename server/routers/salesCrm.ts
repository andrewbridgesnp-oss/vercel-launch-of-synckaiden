import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { salesCrmContacts, salesCrmDeals, salesCrmProposals } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const salesCrmRouter = router({
  // ============= CONTACTS =============
  
  createContact: protectedProcedure
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      source: z.string().optional(),
      status: z.enum(["lead", "prospect", "customer", "inactive"]).default("lead"),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [contact] = await db.insert(salesCrmContacts).values({
        userId: ctx.user.id,
        ...input,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      });
      return { success: true, contactId: contact.insertId };
    }),

  getContacts: protectedProcedure
    .input(z.object({
      status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(salesCrmContacts.userId, ctx.user.id)];
      if (input.status) {
        conditions.push(eq(salesCrmContacts.status, input.status));
      }
      
      const contacts = await db
        .select()
        .from(salesCrmContacts)
        .where(and(...conditions))
        .orderBy(desc(salesCrmContacts.createdAt))
        .limit(input.limit);
      
      return contacts;
    }),

  updateContact: protectedProcedure
    .input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(salesCrmContacts)
        .set({
          ...updates,
          tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
        })
        .where(and(
          eq(salesCrmContacts.id, id),
          eq(salesCrmContacts.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteContact: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(salesCrmContacts)
        .where(and(
          eq(salesCrmContacts.id, input.id),
          eq(salesCrmContacts.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= DEALS =============
  
  createDeal: protectedProcedure
    .input(z.object({
      contactId: z.number().optional(),
      title: z.string().min(1),
      value: z.number().min(0),
      stage: z.enum(["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"]).default("prospecting"),
      probability: z.number().min(0).max(100).default(0),
      expectedCloseDate: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [deal] = await db.insert(salesCrmDeals).values({
        userId: ctx.user.id,
        ...input,
        expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null,
      });
      return { success: true, dealId: deal.insertId };
    }),

  getDeals: protectedProcedure
    .input(z.object({
      stage: z.enum(["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(salesCrmDeals.userId, ctx.user.id)];
      if (input.stage) {
        conditions.push(eq(salesCrmDeals.stage, input.stage));
      }
      
      const deals = await db
        .select()
        .from(salesCrmDeals)
        .where(and(...conditions))
        .orderBy(desc(salesCrmDeals.createdAt))
        .limit(input.limit);
      
      return deals;
    }),

  updateDeal: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      value: z.number().optional(),
      stage: z.enum(["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      probability: z.number().min(0).max(100).optional(),
      expectedCloseDate: z.string().optional(),
      actualCloseDate: z.string().optional(),
      description: z.string().optional(),
      lostReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(salesCrmDeals)
        .set({
          ...updates,
          expectedCloseDate: updates.expectedCloseDate ? new Date(updates.expectedCloseDate) : undefined,
          actualCloseDate: updates.actualCloseDate ? new Date(updates.actualCloseDate) : undefined,
        })
        .where(and(
          eq(salesCrmDeals.id, id),
          eq(salesCrmDeals.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteDeal: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(salesCrmDeals)
        .where(and(
          eq(salesCrmDeals.id, input.id),
          eq(salesCrmDeals.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= PROPOSALS =============
  
  createProposal: protectedProcedure
    .input(z.object({
      dealId: z.number().optional(),
      title: z.string().min(1),
      content: z.string().min(1),
      totalAmount: z.number().min(0),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [proposal] = await db.insert(salesCrmProposals).values({
        userId: ctx.user.id,
        ...input,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      });
      return { success: true, proposalId: proposal.insertId };
    }),

  getProposals: protectedProcedure
    .input(z.object({
      status: z.enum(["draft", "sent", "viewed", "accepted", "rejected"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(salesCrmProposals.userId, ctx.user.id)];
      if (input.status) {
        conditions.push(eq(salesCrmProposals.status, input.status));
      }
      
      const proposals = await db
        .select()
        .from(salesCrmProposals)
        .where(and(...conditions))
        .orderBy(desc(salesCrmProposals.createdAt))
        .limit(input.limit);
      
      return proposals;
    }),

  updateProposal: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      totalAmount: z.number().optional(),
      status: z.enum(["draft", "sent", "viewed", "accepted", "rejected"]).optional(),
      sentAt: z.string().optional(),
      viewedAt: z.string().optional(),
      respondedAt: z.string().optional(),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(salesCrmProposals)
        .set({
          ...updates,
          sentAt: updates.sentAt ? new Date(updates.sentAt) : undefined,
          viewedAt: updates.viewedAt ? new Date(updates.viewedAt) : undefined,
          respondedAt: updates.respondedAt ? new Date(updates.respondedAt) : undefined,
          expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : undefined,
        })
        .where(and(
          eq(salesCrmProposals.id, id),
          eq(salesCrmProposals.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteProposal: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(salesCrmProposals)
        .where(and(
          eq(salesCrmProposals.id, input.id),
          eq(salesCrmProposals.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= AI FEATURES =============
  
  generateProposalContent: protectedProcedure
    .input(z.object({
      dealTitle: z.string(),
      dealValue: z.number(),
      contactName: z.string(),
      companyName: z.string().optional(),
      requirements: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a professional business proposal writer. Generate compelling, professional proposals that highlight value and build trust.",
          },
          {
            role: "user",
            content: `Generate a professional business proposal for:\n\nDeal: ${input.dealTitle}\nValue: $${(input.dealValue / 100).toFixed(2)}\nClient: ${input.contactName}${input.companyName ? ` at ${input.companyName}` : ""}\n${input.requirements ? `\nRequirements:\n${input.requirements}` : ""}\n\nInclude: Executive Summary, Scope of Work, Timeline, Pricing, and Terms.`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content || "";
      return { content };
    }),

  generateEmailTemplate: protectedProcedure
    .input(z.object({
      contactName: z.string(),
      purpose: z.enum(["introduction", "follow_up", "proposal", "closing"]),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a sales professional writing effective, personalized emails that build relationships and drive action.",
          },
          {
            role: "user",
            content: `Generate a professional sales email for:\n\nRecipient: ${input.contactName}\nPurpose: ${input.purpose}\n${input.context ? `\nContext:\n${input.context}` : ""}\n\nKeep it concise, personalized, and include a clear call-to-action.`,
          },
        ],
      });

      const emailContent = response.choices[0]?.message?.content || "";
      return { emailContent };
    }),
});
