import Stripe from "stripe";
import { ENV } from "./_core/env";
import { calculatePlatformFee, formatPrice } from "./products";

if (!ENV.stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

export const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

/**
 * Create a Stripe Checkout Session for website purchase
 */
export async function createWebsiteCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  productId: string;
  productName: string;
  priceInCents: number;
  origin: string;
}): Promise<{ url: string; sessionId: string }> {
  const platformFee = calculatePlatformFee(params.priceInCents);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
      product_id: params.productId,
      platform_fee: platformFee.toString(),
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.productName,
            description: `Platform fee (${33}%): ${formatPrice(platformFee)}`,
          },
          unit_amount: params.priceInCents,
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: `${params.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/payment/cancel`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createSubscriptionCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  priceId: string;
  productName: string;
  origin: string;
}): Promise<{ url: string; sessionId: string }> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
    },
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: `${params.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/payment/cancel`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Retrieve customer details
 */
export async function getCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId);
}

/**
 * List customer's payment intents
 */
export async function listCustomerPayments(customerId: string) {
  return stripe.paymentIntents.list({
    customer: customerId,
    limit: 100,
  });
}
