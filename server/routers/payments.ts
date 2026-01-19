import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { subscriptions, payments, products, prices } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { createCheckoutSession, createPortalSession } from "../billing/stripe";

export const paymentsRouter = router({
  createStripeCheckout: protectedProcedure
    .input(z.object({ priceId: z.string(), successUrl: z.string().optional(), cancelUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const session = await createCheckoutSession({
        priceId: input.priceId,
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        successUrl: input.successUrl || `${process.env.VITE_FRONTEND_FORGE_API_URL}/dashboard?payment=success`,
        cancelUrl: input.cancelUrl || `${process.env.VITE_FRONTEND_FORGE_API_URL}/premium-apps?payment=cancelled`,
      });
      return { sessionId: session.id, url: session.url };
    }),

  createStripePortal: protectedProcedure.mutation(async ({ ctx }) => {
    const session = await createPortalSession({
      userId: ctx.user.id,
      returnUrl: `${process.env.VITE_FRONTEND_FORGE_API_URL}/dashboard`,
    });
    return { url: session.url };
  }),

  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db.select().from(payments).where(eq(payments.userId, ctx.user.id)).orderBy(desc(payments.createdAt)).limit(50);
  }),

  getActiveSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db.select().from(subscriptions).where(and(eq(subscriptions.userId, ctx.user.id), eq(subscriptions.status, "active"))).orderBy(desc(subscriptions.createdAt));
  }),
});
