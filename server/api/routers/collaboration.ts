import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../_core/trpc";
import { getDb } from "../../db";
import { teamMessages, tasks, timeEntries, approvals } from "../../../drizzle/schema";
import { eq, and, desc, or } from "drizzle-orm";

export const collaborationRouter = router({
  // ===== MESSAGING =====

  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        recipientId: z.number().optional(),
        channelId: z.number().optional(),
        content: z.string(),
        attachments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(teamMessages).values({
        workspaceId: input.workspaceId,
        senderId: ctx.user.id,
        recipientId: input.recipientId,
        channelId: input.channelId,
        content: input.content,
        attachments: input.attachments,
      });

      return { id: Number(result[0].insertId) };
    }),

  // Get messages
  getMessages: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        recipientId: z.number().optional(),
        channelId: z.number().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      let query = db
        .select()
        .from(teamMessages)
        .where(eq(teamMessages.workspaceId, input.workspaceId))
        .orderBy(desc(teamMessages.createdAt))
        .limit(input.limit);

      // Filter by recipient or channel
      if (input.recipientId) {
        query = db
          .select()
          .from(teamMessages)
          .where(
            and(
              eq(teamMessages.workspaceId, input.workspaceId),
              or(
                and(
                  eq(teamMessages.senderId, ctx.user.id),
                  eq(teamMessages.recipientId, input.recipientId)
                ),
                and(
                  eq(teamMessages.senderId, input.recipientId),
                  eq(teamMessages.recipientId, ctx.user.id)
                )
              )
            )
          )
          .orderBy(desc(teamMessages.createdAt))
          .limit(input.limit);
      } else if (input.channelId) {
        query = db
          .select()
          .from(teamMessages)
          .where(
            and(
              eq(teamMessages.workspaceId, input.workspaceId),
              eq(teamMessages.channelId, input.channelId)
            )
          )
          .orderBy(desc(teamMessages.createdAt))
          .limit(input.limit);
      }

      const results = await query;
      return results.reverse(); // Show oldest first
    }),

  // Mark message as read
  markRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get current readBy array
      const message = await db
        .select()
        .from(teamMessages)
        .where(eq(teamMessages.id, input.messageId))
        .limit(1);

      if (message.length > 0) {
        const readBy = (message[0].readBy as number[]) || [];
        if (!readBy.includes(ctx.user.id)) {
          readBy.push(ctx.user.id);
          await db
            .update(teamMessages)
            .set({ readBy })
            .where(eq(teamMessages.id, input.messageId));
        }
      }

      return { success: true };
    }),

  // ===== TASKS =====

  // Create task
  createTask: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        assignedTo: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(tasks).values({
        workspaceId: input.workspaceId,
        title: input.title,
        description: input.description,
        assignedTo: input.assignedTo,
        assignedBy: ctx.user.id,
        priority: input.priority,
        status: "todo",
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        tags: input.tags,
      });

      return { id: Number(result[0].insertId) };
    }),

  // List tasks
  listTasks: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        assignedTo: z.number().optional(),
        status: z.enum(["todo", "in_progress", "review", "completed"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      let conditions = [eq(tasks.workspaceId, input.workspaceId)];

      if (input.assignedTo) {
        conditions.push(eq(tasks.assignedTo, input.assignedTo));
      }

      if (input.status) {
        conditions.push(eq(tasks.status, input.status));
      }

      const results = await db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt));

      return results;
    }),

  // Update task
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        assignedTo: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        status: z.enum(["todo", "in_progress", "review", "completed"]).optional(),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { id, dueDate, ...updates } = input;

      const updateData: any = { ...updates };
      if (dueDate) {
        updateData.dueDate = new Date(dueDate);
      }

      if (updates.status === "completed") {
        updateData.completedAt = new Date();
      }

      await db.update(tasks).set(updateData).where(eq(tasks.id, id));

      return { success: true };
    }),

  // Delete task
  deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(tasks).where(eq(tasks.id, input.id));

      return { success: true };
    }),

  // ===== TIME TRACKING =====

  // Start time entry
  startTimer: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        taskId: z.number().optional(),
        description: z.string().optional(),
        billable: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(timeEntries).values({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        taskId: input.taskId,
        description: input.description,
        startTime: new Date(),
        billable: input.billable,
      });

      return { id: Number(result[0].insertId) };
    }),

  // Stop time entry
  stopTimer: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const entry = await db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.id, input.id))
        .limit(1);

      if (entry.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Time entry not found" });
      }

      const endTime = new Date();
      const startTime = entry[0].startTime;
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // seconds

      await db
        .update(timeEntries)
        .set({
          endTime,
          duration,
        })
        .where(eq(timeEntries.id, input.id));

      return { success: true, duration };
    }),

  // List time entries
  listTimeEntries: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        userId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      let conditions = [eq(timeEntries.workspaceId, input.workspaceId)];

      if (input.userId) {
        conditions.push(eq(timeEntries.userId, input.userId));
      }

      const results = await db
        .select()
        .from(timeEntries)
        .where(and(...conditions))
        .orderBy(desc(timeEntries.startTime));

      return results;
    }),

  // Get time tracking analytics
  getTimeAnalytics: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      let conditions = [eq(timeEntries.workspaceId, input.workspaceId)];

      if (input.userId) {
        conditions.push(eq(timeEntries.userId, input.userId));
      }

      const entries = await db
        .select()
        .from(timeEntries)
        .where(and(...conditions));

      const totalHours = entries.reduce((sum, e) => sum + (e.duration || 0), 0) / 3600;
      const billableHours = entries
        .filter((e) => e.billable)
        .reduce((sum, e) => sum + (e.duration || 0), 0) / 3600;

      return {
        totalHours: Math.round(totalHours * 100) / 100,
        billableHours: Math.round(billableHours * 100) / 100,
        entriesCount: entries.length,
      };
    }),

  // ===== APPROVALS =====

  // Create approval request
  requestApproval: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        type: z.enum(["contract", "tax_filing", "expense", "invoice", "document"]),
        entityId: z.number(),
        approverId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(approvals).values({
        workspaceId: input.workspaceId,
        type: input.type,
        entityId: input.entityId,
        requestedBy: ctx.user.id,
        approverId: input.approverId,
        status: "pending",
        notes: input.notes,
      });

      return { id: Number(result[0].insertId) };
    }),

  // List pending approvals
  listApprovals: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        approverId: z.number().optional(),
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      let conditions = [eq(approvals.workspaceId, input.workspaceId)];

      if (input.approverId) {
        conditions.push(eq(approvals.approverId, input.approverId));
      }

      if (input.status) {
        conditions.push(eq(approvals.status, input.status));
      }

      const results = await db
        .select()
        .from(approvals)
        .where(and(...conditions))
        .orderBy(desc(approvals.createdAt));

      return results;
    }),

  // Approve request
  approve: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(approvals)
        .set({
          status: "approved",
          approvedAt: new Date(),
          notes: input.notes,
        })
        .where(eq(approvals.id, input.id));

      return { success: true };
    }),

  // Reject request
  reject: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(approvals)
        .set({
          status: "rejected",
          notes: input.reason,
        })
        .where(eq(approvals.id, input.id));

      return { success: true };
    }),
});
