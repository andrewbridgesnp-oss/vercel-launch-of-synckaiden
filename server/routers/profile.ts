import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { profiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, ctx.user.id))
      .limit(1);

    if (!profile) {
      // Create default profile if it doesn't exist
      const [newProfile] = await db
        .insert(profiles)
        .values({
          userId: ctx.user.id,
          displayName: ctx.user.name || "User",
          bio: null,
          avatar: null,
          location: null,
          website: null,
          timezone: "America/New_York",
          language: "en",
          notificationPreferences: JSON.stringify({
            email: true,
            sms: false,
            push: true,
          }),
        })
        .returning();

      return newProfile;
    }

    return profile;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        timezone: z.string().optional(),
        language: z.string().optional(),
        notificationPreferences: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const [updatedProfile] = await db
        .update(profiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, ctx.user.id))
        .returning();

      return updatedProfile;
    }),

  // Get public profile by user ID
  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const [profile] = await db
        .select({
          displayName: profiles.displayName,
          bio: profiles.bio,
          avatar: profiles.avatar,
          location: profiles.location,
          website: profiles.website,
        })
        .from(profiles)
        .where(eq(profiles.userId, input.userId))
        .limit(1);

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return profile;
    }),
});
