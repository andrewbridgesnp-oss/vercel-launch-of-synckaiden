import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { helpDeskTickets, helpDeskReplies } from "../../drizzle/schema.js";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import { invokeLLM } from "../_core/llm.js";

export const helpDeskRouter = router({
  // ========== TICKETS ==========
  
  createTicket: protectedProcedure
    .input(z.object({
      customerName: z.string().min(1).max(255),
      customerEmail: z.string().email().max(320),
      subject: z.string().min(1).max(500),
      description: z.string().min(1),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      category: z.string().max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [ticket] = await db.insert(helpDeskTickets).values({
        userId: ctx.user.id,
        ...input,
      }).$returningId();
      return ticket;
    }),

  getTickets: protectedProcedure
    .input(z.object({
      status: z.enum(["open", "in_progress", "waiting", "resolved", "closed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      search: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(helpDeskTickets.userId, ctx.user.id)];
      
      if (input?.status) {
        conditions.push(eq(helpDeskTickets.status, input.status));
      }
      if (input?.priority) {
        conditions.push(eq(helpDeskTickets.priority, input.priority));
      }
      if (input?.search) {
        conditions.push(or(
          like(helpDeskTickets.subject, `%${input.search}%`),
          like(helpDeskTickets.customerName, `%${input.search}%`),
          like(helpDeskTickets.customerEmail, `%${input.search}%`)
        )!);
      }
      
      return await db.select().from(helpDeskTickets)
        .where(and(...conditions))
        .orderBy(desc(helpDeskTickets.createdAt))
        .limit(input?.limit || 50);
    }),

  getTicket: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [ticket] = await db.select().from(helpDeskTickets)
        .where(and(
          eq(helpDeskTickets.id, input.id),
          eq(helpDeskTickets.userId, ctx.user.id)
        ))
        .limit(1);
      return ticket;
    }),

  updateTicket: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      subject: z.string().min(1).max(500).optional(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      status: z.enum(["open", "in_progress", "waiting", "resolved", "closed"]).optional(),
      category: z.string().max(100).optional(),
      assignedTo: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      
      // Auto-set resolvedAt when status changes to resolved
      if (updates.status === "resolved") {
        (updates as any).resolvedAt = new Date();
      }
      
      await db.update(helpDeskTickets)
        .set(updates)
        .where(and(
          eq(helpDeskTickets.id, id),
          eq(helpDeskTickets.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteTicket: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Delete replies first
      await db.delete(helpDeskReplies)
        .where(eq(helpDeskReplies.ticketId, input.id));
      // Delete ticket
      await db.delete(helpDeskTickets)
        .where(and(
          eq(helpDeskTickets.id, input.id),
          eq(helpDeskTickets.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== REPLIES ==========

  createReply: protectedProcedure
    .input(z.object({
      ticketId: z.number().int(),
      message: z.string().min(1),
      isStaff: z.boolean().default(true),
      attachments: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [reply] = await db.insert(helpDeskReplies).values({
        ticketId: input.ticketId,
        userId: ctx.user.id,
        message: input.message,
        isStaff: input.isStaff,
        attachments: input.attachments,
      }).$returningId();
      
      // Auto-update ticket status to in_progress if it was open
      await db.update(helpDeskTickets)
        .set({ status: "in_progress" })
        .where(and(
          eq(helpDeskTickets.id, input.ticketId),
          eq(helpDeskTickets.status, "open")
        ));
      
      return reply;
    }),

  getReplies: protectedProcedure
    .input(z.object({
      ticketId: z.number().int(),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return await db.select().from(helpDeskReplies)
        .where(eq(helpDeskReplies.ticketId, input.ticketId))
        .orderBy(desc(helpDeskReplies.createdAt))
        .limit(input.limit);
    }),

  deleteReply: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(helpDeskReplies)
        .where(eq(helpDeskReplies.id, input.id));
      return { success: true };
    }),

  // ========== AI FEATURES ==========

  generateResponse: protectedProcedure
    .input(z.object({
      ticketId: z.number().int(),
      tone: z.enum(["professional", "friendly", "technical"]).default("professional"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Get ticket details
      const [ticket] = await db.select().from(helpDeskTickets)
        .where(and(
          eq(helpDeskTickets.id, input.ticketId),
          eq(helpDeskTickets.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!ticket) throw new Error("Ticket not found");
      
      // Get previous replies for context
      const replies = await db.select().from(helpDeskReplies)
        .where(eq(helpDeskReplies.ticketId, input.ticketId))
        .orderBy(desc(helpDeskReplies.createdAt))
        .limit(5);
      
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a helpful customer support agent. Generate ${input.tone} responses to customer support tickets. Be empathetic, solution-oriented, and clear.`
          },
          {
            role: "user",
            content: `Generate a response for this support ticket:

Subject: ${ticket.subject}
Description: ${ticket.description}
Priority: ${ticket.priority}
Category: ${ticket.category || "General"}

${replies.length > 0 ? `Previous conversation:\n${replies.map(r => `${r.isStaff ? "Staff" : "Customer"}: ${r.message}`).join("\n")}` : ""}

Write a helpful response that addresses the customer's issue.`
          }
        ],
      });
      
      return { response: response.choices[0].message.content };
    }),

  // ========== ANALYTICS ==========

  getAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const [stats] = await db.select({
        total: sql<number>`COUNT(*)`,
        open: sql<number>`SUM(CASE WHEN ${helpDeskTickets.status} = 'open' THEN 1 ELSE 0 END)`,
        inProgress: sql<number>`SUM(CASE WHEN ${helpDeskTickets.status} = 'in_progress' THEN 1 ELSE 0 END)`,
        waiting: sql<number>`SUM(CASE WHEN ${helpDeskTickets.status} = 'waiting' THEN 1 ELSE 0 END)`,
        resolved: sql<number>`SUM(CASE WHEN ${helpDeskTickets.status} = 'resolved' THEN 1 ELSE 0 END)`,
        closed: sql<number>`SUM(CASE WHEN ${helpDeskTickets.status} = 'closed' THEN 1 ELSE 0 END)`,
        urgent: sql<number>`SUM(CASE WHEN ${helpDeskTickets.priority} = 'urgent' THEN 1 ELSE 0 END)`,
        high: sql<number>`SUM(CASE WHEN ${helpDeskTickets.priority} = 'high' THEN 1 ELSE 0 END)`,
      }).from(helpDeskTickets)
        .where(eq(helpDeskTickets.userId, ctx.user.id));
      
      return stats;
    }),
});
