import { z } from "zod";
import { router, adminProcedure } from "../../_core/trpc";
import { getDb } from "../../db";
import { users } from "../../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  list: adminProcedure.input(z.object({ limit: z.number().default(50) })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(input.limit);
    return { users: allUsers };
  }),
  updateRole: adminProcedure.input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    if (ctx.user.id === input.userId && input.role === "user") throw new TRPCError({ code: "FORBIDDEN", message: "Cannot demote yourself" });
    await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
    return { success: true };
  }),
});
