import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { 
  projectManagerProjects,
  projectManagerTasks,
  projectManagerMilestones,
  type InsertProjectManagerProject,
  type InsertProjectManagerTask,
  type InsertProjectManagerMilestone
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const projectManagerRouter = router({
  // ============= PROJECTS =============
  
  getProjects: protectedProcedure
    .input(z.object({
      status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(projectManagerProjects)
        .where(eq(projectManagerProjects.userId, ctx.user.id));
      
      if (input.status) {
        query = query.where(eq(projectManagerProjects.status, input.status));
      }
      
      return await query.orderBy(desc(projectManagerProjects.createdAt));
    }),

  getProjectById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [project] = await db
        .select()
        .from(projectManagerProjects)
        .where(and(
          eq(projectManagerProjects.id, input.id),
          eq(projectManagerProjects.userId, ctx.user.id)
        ));
      
      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }
      
      return project;
    }),

  createProject: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).default("planning"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().int().positive().optional(),
      color: z.string().max(7).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [project] = await db.insert(projectManagerProjects).values({
        userId: ctx.user.id,
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
      } as InsertProjectManagerProject).$returningId();
      
      return project;
    }),

  updateProject: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().int().positive().optional(),
      color: z.string().max(7).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates };
      if (updates.startDate) updateData.startDate = new Date(updates.startDate);
      if (updates.endDate) updateData.endDate = new Date(updates.endDate);
      
      await db
        .update(projectManagerProjects)
        .set(updateData)
        .where(and(
          eq(projectManagerProjects.id, id),
          eq(projectManagerProjects.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Delete all tasks and milestones first
      await db
        .delete(projectManagerTasks)
        .where(and(
          eq(projectManagerTasks.projectId, input.id),
          eq(projectManagerTasks.userId, ctx.user.id)
        ));
      
      await db
        .delete(projectManagerMilestones)
        .where(and(
          eq(projectManagerMilestones.projectId, input.id),
          eq(projectManagerMilestones.userId, ctx.user.id)
        ));
      
      await db
        .delete(projectManagerProjects)
        .where(and(
          eq(projectManagerProjects.id, input.id),
          eq(projectManagerProjects.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= TASKS =============
  
  getTasks: protectedProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      let query = db
        .select()
        .from(projectManagerTasks)
        .where(and(
          eq(projectManagerTasks.projectId, input.projectId),
          eq(projectManagerTasks.userId, ctx.user.id)
        ));
      
      if (input.status) {
        query = query.where(eq(projectManagerTasks.status, input.status));
      }
      
      return await query.orderBy(projectManagerTasks.dueDate);
    }),

  createTask: protectedProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      assignee: z.string().max(255).optional(),
      dueDate: z.string().optional(),
      estimatedHours: z.number().positive().optional(),
      parentTaskId: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [task] = await db.insert(projectManagerTasks).values({
        userId: ctx.user.id,
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        estimatedHours: input.estimatedHours?.toString(),
      } as InsertProjectManagerTask).$returningId();
      
      return task;
    }),

  updateTask: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      assignee: z.string().max(255).optional(),
      dueDate: z.string().optional(),
      estimatedHours: z.number().positive().optional(),
      actualHours: z.number().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      const updateData: any = { ...updates };
      if (updates.dueDate) updateData.dueDate = new Date(updates.dueDate);
      if (updates.estimatedHours) updateData.estimatedHours = updates.estimatedHours.toString();
      if (updates.actualHours) updateData.actualHours = updates.actualHours.toString();
      
      await db
        .update(projectManagerTasks)
        .set(updateData)
        .where(and(
          eq(projectManagerTasks.id, id),
          eq(projectManagerTasks.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(projectManagerTasks)
        .where(and(
          eq(projectManagerTasks.id, input.id),
          eq(projectManagerTasks.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= MILESTONES =============
  
  getMilestones: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return await db
        .select()
        .from(projectManagerMilestones)
        .where(and(
          eq(projectManagerMilestones.projectId, input.projectId),
          eq(projectManagerMilestones.userId, ctx.user.id)
        ))
        .orderBy(projectManagerMilestones.dueDate);
    }),

  createMilestone: protectedProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      dueDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [milestone] = await db.insert(projectManagerMilestones).values({
        userId: ctx.user.id,
        ...input,
        dueDate: new Date(input.dueDate),
      } as InsertProjectManagerMilestone).$returningId();
      
      return milestone;
    }),

  completeMilestone: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(projectManagerMilestones)
        .set({ isCompleted: true, completedAt: new Date() })
        .where(and(
          eq(projectManagerMilestones.id, input.id),
          eq(projectManagerMilestones.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteMilestone: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(projectManagerMilestones)
        .where(and(
          eq(projectManagerMilestones.id, input.id),
          eq(projectManagerMilestones.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= ANALYTICS =============
  
  getProjectStats: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      
      const [stats] = await db
        .select({
          totalTasks: sql<number>`COUNT(*)`,
          completedTasks: sql<number>`SUM(CASE WHEN ${projectManagerTasks.status} = 'done' THEN 1 ELSE 0 END)`,
          inProgressTasks: sql<number>`SUM(CASE WHEN ${projectManagerTasks.status} = 'in_progress' THEN 1 ELSE 0 END)`,
          totalEstimatedHours: sql<number>`SUM(${projectManagerTasks.estimatedHours})`,
          totalActualHours: sql<number>`SUM(${projectManagerTasks.actualHours})`,
        })
        .from(projectManagerTasks)
        .where(and(
          eq(projectManagerTasks.projectId, input.projectId),
          eq(projectManagerTasks.userId, ctx.user.id)
        ));
      
      return stats;
    }),
});
