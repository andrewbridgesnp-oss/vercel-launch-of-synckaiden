import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../../_core/trpc";
import { getDb } from "../../db";
import { workspaces, workspaceMembers, workspaceInvitations } from "../../../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";
import { randomBytes } from "crypto";

export const workspacesRouter = router({
  // Get all workspaces for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    
    // Get workspaces where user is a member
    const memberships = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, ctx.user.id));
    
    if (memberships.length === 0) {
      return [];
    }
    
    const workspaceIds = memberships.map(m => m.workspaceId);
    const userWorkspaces = await db
      .select()
      .from(workspaces)
      .where(inArray(workspaces.id, workspaceIds));
    
    return userWorkspaces.map(ws => ({
      ...ws,
      role: memberships.find(m => m.workspaceId === ws.id)?.role || "member",
    }));
  }),

  // Get current workspace details
  get: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if user has access to this workspace
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      
      const workspace = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .limit(1);
      
      if (workspace.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found" });
      }
      
      return {
        ...workspace[0],
        role: membership[0].role,
      };
    }),

  // Create new workspace
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if slug is available
      const existing = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.slug, input.slug))
        .limit(1);
      
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Workspace slug already taken" });
      }
      
      // Create workspace
      const result = await db
        .insert(workspaces)
        .values({
          name: input.name,
          slug: input.slug,
          ownerId: ctx.user.id,
          plan: "free",
          subscriptionStatus: "trialing",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });
      
      const workspaceId = Number(result[0].insertId);
      
      // Add creator as owner member
      await db.insert(workspaceMembers).values({
        workspaceId: workspaceId,
        userId: ctx.user.id,
        role: "owner",
        invitedBy: ctx.user.id,
        joinedAt: new Date(),
        status: "active",
      });
      
      return { id: workspaceId };
    }),

  // Update workspace
  update: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        name: z.string().min(1).max(255).optional(),
        logo: z.string().optional(),
        primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        settings: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if user is owner or admin
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0 || !["owner", "admin"].includes(membership[0].role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owners and admins can update workspace" });
      }
      
      const { workspaceId, ...updates } = input;
      
      await db
        .update(workspaces)
        .set(updates)
        .where(eq(workspaces.id, workspaceId));
      
      return { success: true };
    }),

  // Get workspace members
  getMembers: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check access
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      
      const members = await db
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, input.workspaceId));
      
      return members;
    }),

  // Invite team member
  inviteMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        email: z.string().email(),
        role: z.enum(["admin", "cpa", "lawyer", "receptionist", "member"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if user is owner or admin
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0 || !["owner", "admin"].includes(membership[0].role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owners and admins can invite members" });
      }
      
      // Generate invitation token
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const result = await db
        .insert(workspaceInvitations)
        .values({
          workspaceId: input.workspaceId,
          email: input.email,
          role: input.role,
          invitedBy: ctx.user.id,
          token,
          expiresAt,
        });
      
      const invitationId = result[0].insertId;
      
      // TODO: Send invitation email
      
      return { invitationId, token };
    }),

  // Remove team member
  removeMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        memberId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if user is owner or admin
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0 || !["owner", "admin"].includes(membership[0].role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owners and admins can remove members" });
      }
      
      // Can't remove owner
      const targetMember = await db
        .select()
        .from(workspaceMembers)
        .where(eq(workspaceMembers.id, input.memberId))
        .limit(1);
      
      if (targetMember.length > 0 && targetMember[0].role === "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot remove workspace owner" });
      }
      
      await db
        .delete(workspaceMembers)
        .where(eq(workspaceMembers.id, input.memberId));
      
      return { success: true };
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        memberId: z.number(),
        role: z.enum(["admin", "cpa", "lawyer", "receptionist", "member"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if user is owner
      const membership = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, input.workspaceId),
            eq(workspaceMembers.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (membership.length === 0 || membership[0].role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only workspace owner can change roles" });
      }
      
      await db
        .update(workspaceMembers)
        .set({ role: input.role })
        .where(eq(workspaceMembers.id, input.memberId));
      
      return { success: true };
    }),
});
