/**
 * Approvals Router - tRPC procedures for task approval workflows
 */

import { router, protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import {
  createWorkflowTask,
  getPendingTasks,
  approveTask,
  rejectTask,
  executeTask,
} from "../../_core/workflowService";

export const approvalsRouter = router({
  /**
   * Create a new task requiring approval
   */
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        action: z.string(),
        parameters: z.record(z.string(), z.any()),
        requiresApproval: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const task = await createWorkflowTask(
          ctx.user.id,
          input.title,
          input.description,
          input.action,
          input.parameters,
          input.requiresApproval
        );

        return {
          success: true,
          task,
        };
      } catch (error) {
        console.error("Failed to create task:", error);
        return {
          success: false,
          error: "Failed to create task",
        };
      }
    }),

  /**
   * Get pending tasks awaiting approval
   */
  getPendingTasks: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await getPendingTasks(ctx.user.id);
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error("Failed to get pending tasks:", error);
      return {
        success: false,
        pendingTasks: [],
        totalCount: 0,
        error: "Failed to fetch pending tasks",
      };
    }
  }),

  /**
   * Approve a pending task
   */
  approveTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await approveTask(input.taskId, ctx.user.id, input.notes);
        return result;
      } catch (error) {
        console.error("Failed to approve task:", error);
        return {
          success: false,
          error: "Failed to approve task",
        };
      }
    }),

  /**
   * Reject a pending task
   */
  rejectTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await rejectTask(input.taskId, ctx.user.id, input.reason);
        return result;
      } catch (error) {
        console.error("Failed to reject task:", error);
        return {
          success: false,
          error: "Failed to reject task",
        };
      }
    }),

  /**
   * Execute an approved task
   */
  executeTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await executeTask(input.taskId, ctx.user.id);
        return {
          success: true,
          ...result,
        };
      } catch (error) {
        console.error("Failed to execute task:", error);
        return {
          success: false,
          error: "Failed to execute task",
        };
      }
    }),
});
