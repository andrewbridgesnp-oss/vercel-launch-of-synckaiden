import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { timeTrackerProjects, timeTrackerEntries } from "../../drizzle/schema.js";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export const timeTrackerRouter = router({
  // ========== PROJECTS ==========
  
  createProject: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      billableRate: z.number().int().min(0).optional(), // cents per hour
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [project] = await db.insert(timeTrackerProjects).values({
        userId: ctx.user.id,
        ...input,
      }).$returningId();
      return project;
    }),

  getProjects: protectedProcedure
    .input(z.object({
      includeInactive: z.boolean().default(false),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(timeTrackerProjects.userId, ctx.user.id)];
      if (!input?.includeInactive) {
        conditions.push(eq(timeTrackerProjects.isActive, true));
      }
      return await db.select().from(timeTrackerProjects)
        .where(and(...conditions))
        .orderBy(desc(timeTrackerProjects.createdAt));
    }),

  updateProject: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      billableRate: z.number().int().min(0).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      await db.update(timeTrackerProjects)
        .set(updates)
        .where(and(
          eq(timeTrackerProjects.id, id),
          eq(timeTrackerProjects.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(timeTrackerProjects)
        .where(and(
          eq(timeTrackerProjects.id, input.id),
          eq(timeTrackerProjects.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== TIME ENTRIES ==========

  startTimer: protectedProcedure
    .input(z.object({
      projectId: z.number().int(),
      description: z.string().optional(),
      isBillable: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [entry] = await db.insert(timeTrackerEntries).values({
        userId: ctx.user.id,
        projectId: input.projectId,
        description: input.description,
        isBillable: input.isBillable,
        startTime: new Date(),
      }).$returningId();
      return entry;
    }),

  stopTimer: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const endTime = new Date();
      
      // Get start time
      const [entry] = await db.select().from(timeTrackerEntries)
        .where(and(
          eq(timeTrackerEntries.id, input.id),
          eq(timeTrackerEntries.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!entry) throw new Error("Entry not found");
      
      const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);
      
      await db.update(timeTrackerEntries)
        .set({ endTime, duration })
        .where(eq(timeTrackerEntries.id, input.id));
      
      return { success: true, duration };
    }),

  getEntries: protectedProcedure
    .input(z.object({
      projectId: z.number().int().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(timeTrackerEntries.userId, ctx.user.id)];
      
      if (input?.projectId) {
        conditions.push(eq(timeTrackerEntries.projectId, input.projectId));
      }
      if (input?.startDate) {
        conditions.push(gte(timeTrackerEntries.startTime, input.startDate));
      }
      if (input?.endDate) {
        conditions.push(lte(timeTrackerEntries.startTime, input.endDate));
      }
      
      return await db.select().from(timeTrackerEntries)
        .where(and(...conditions))
        .orderBy(desc(timeTrackerEntries.startTime))
        .limit(input?.limit || 50);
    }),

  updateEntry: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      description: z.string().optional(),
      startTime: z.date().optional(),
      endTime: z.date().optional(),
      isBillable: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      
      // Recalculate duration if times changed
      if (updates.startTime || updates.endTime) {
        const [entry] = await db.select().from(timeTrackerEntries)
          .where(eq(timeTrackerEntries.id, id))
          .limit(1);
        
        const start = updates.startTime || entry.startTime;
        const end = updates.endTime || entry.endTime;
        
        if (start && end) {
          (updates as any).duration = Math.floor((end.getTime() - start.getTime()) / 1000);
        }
      }
      
      await db.update(timeTrackerEntries)
        .set(updates)
        .where(and(
          eq(timeTrackerEntries.id, id),
          eq(timeTrackerEntries.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteEntry: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(timeTrackerEntries)
        .where(and(
          eq(timeTrackerEntries.id, input.id),
          eq(timeTrackerEntries.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== ANALYTICS ==========

  getAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      projectId: z.number().int().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [
        eq(timeTrackerEntries.userId, ctx.user.id),
        gte(timeTrackerEntries.startTime, input.startDate),
        lte(timeTrackerEntries.startTime, input.endDate),
      ];
      
      if (input.projectId) {
        conditions.push(eq(timeTrackerEntries.projectId, input.projectId));
      }
      
      const [stats] = await db.select({
        totalSeconds: sql<number>`COALESCE(SUM(${timeTrackerEntries.duration}), 0)`,
        billableSeconds: sql<number>`COALESCE(SUM(CASE WHEN ${timeTrackerEntries.isBillable} THEN ${timeTrackerEntries.duration} ELSE 0 END), 0)`,
        entryCount: sql<number>`COUNT(*)`,
      }).from(timeTrackerEntries)
        .where(and(...conditions));
      
      return {
        totalHours: stats.totalSeconds / 3600,
        billableHours: stats.billableSeconds / 3600,
        nonBillableHours: (stats.totalSeconds - stats.billableSeconds) / 3600,
        entryCount: stats.entryCount,
      };
    }),
});
