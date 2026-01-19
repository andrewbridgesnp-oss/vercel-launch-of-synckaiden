import { Router } from "express";
import Stripe from "stripe";
import { getDb } from "../../db";
import { featurePurchases } from "../../../drizzle/schema-purchases";
import { users } from "../../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { notifyOwner } from "../../_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const stripeWebhookRouter = Router();

/**
 * Stripe webhook endpoint for handling checkout.session.completed events
 * Automatically activates purchased features for users
 */
stripeWebhookRouter.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  try {
    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata?.userId || !session.metadata?.feature) {
        console.warn("Webhook received without required metadata");
        return res.status(200).json({ received: true });
      }

      const userId = parseInt(session.metadata.userId);
      const feature = session.metadata.feature;

      const db = await getDb();
      if (!db) {
        console.error("Database not available");
        return res.status(500).json({ error: "Database unavailable" });
      }

      // Find the pending purchase record
      const purchase = await db
        .select()
        .from(featurePurchases)
        .where(
          and(
            eq(featurePurchases.stripeCheckoutSessionId, session.id),
            eq(featurePurchases.userId, userId),
            eq(featurePurchases.featureName, feature)
          )
        )
        .limit(1);

      if (purchase.length === 0) {
        console.warn(`Purchase record not found for session ${session.id}`);
        return res.status(200).json({ received: true });
      }

      const p = purchase[0];

      // Update purchase to completed
      await db
        .update(featurePurchases)
        .set({
          status: "completed",
          isActive: true,
          stripePaymentIntentId: session.payment_intent as string,
        })
        .where(eq(featurePurchases.id, p.id));

      // Get user info for notification
      const userRecord = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userRecord.length > 0) {
        const user = userRecord[0];

        // Send notification to user (if notification system is available)
        try {
          await notifyOwner({
            title: `Feature Purchase Confirmed: ${feature}`,
            content: `User ${user.name || user.email} has successfully purchased ${feature}. Amount: $${(p.amount / 100).toFixed(2)}`,
          });
        } catch (error) {
          console.warn("Failed to send owner notification:", error);
        }
      }

      console.log(
        `✅ Feature purchase activated: user ${userId}, feature ${feature}`
      );
    }

    // Handle charge.refunded event
    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;

      if (!charge.payment_intent) {
        return res.status(200).json({ received: true });
      }

      const db = await getDb();
      if (!db) {
        console.error("Database not available");
        return res.status(500).json({ error: "Database unavailable" });
      }

      // Mark purchase as refunded
      const purchase = await db
        .select()
        .from(featurePurchases)
        .where(
          eq(featurePurchases.stripePaymentIntentId, charge.payment_intent as string)
        )
        .limit(1);

      if (purchase.length > 0) {
        await db
          .update(featurePurchases)
          .set({
            status: "refunded",
            isActive: false,
          })
          .where(eq(featurePurchases.id, purchase[0].id));

        console.log(
          `🔄 Feature purchase refunded: ${purchase[0].featureName}`
        );
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get purchase history for a user (for analytics)
 */
stripeWebhookRouter.get("/purchases/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const purchases = await db
      .select()
      .from(featurePurchases)
      .where(eq(featurePurchases.userId, userId));

    res.json({
      userId,
      purchases: purchases.map((p) => ({
        id: p.id,
        feature: p.featureName,
        amount: p.amount,
        status: p.status,
        purchasedAt: p.createdAt,
        expiresAt: p.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
