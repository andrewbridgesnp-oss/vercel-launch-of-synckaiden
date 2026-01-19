import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

// Base URL for redirects
const getBaseUrl = () => {
  return process.env.NODE_ENV === "production" 
    ? "https://kayden-ai.manus.space" 
    : "http://localhost:3000";
};

export const stripeRouter = router({
  // Subscription checkout (for Kaiden AI plans)
  createCheckoutSession: protectedProcedure
    .input(z.object({
      priceId: z.string(),
      tier: z.enum(["starter", "professional", "enterprise", "ultimate"]),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${getBaseUrl()}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl()}/pricing`,
          metadata: {
            userId: ctx.user.id,
            tier: input.tier,
            tenant: "kayden",
            source: "web",
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Stripe checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // Guest checkout (for Bougie Boutique - no login required)
  createGuestCheckout: publicProcedure
    .input(z.object({
      productName: z.string(),
      productDescription: z.string().optional(),
      priceInCents: z.number().min(100),
      quantity: z.number().min(1).default(1),
      productId: z.number().optional(),
      imageUrl: z.string().optional(),
      tenant: z.enum(["emilie", "kayden", "shop"]).default("emilie"),
      cartItems: z.array(z.object({
        name: z.string(),
        category: z.string(),
        size: z.string(),
        color: z.string(),
        price: z.number(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Build line items from cart or single product
        const lineItems = input.cartItems && input.cartItems.length > 0
          ? input.cartItems.map(item => ({
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.name,
                  description: `${item.category} - Size: ${item.size}, Color: ${item.color}`,
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: 1,
            }))
          : [{
              price_data: {
                currency: "usd",
                product_data: {
                  name: input.productName,
                  description: input.productDescription || undefined,
                  images: input.imageUrl ? [input.imageUrl] : undefined,
                },
                unit_amount: input.priceInCents,
              },
              quantity: input.quantity,
            }];

        const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: "payment",
          // Allow promo codes
          allow_promotion_codes: true,
          // CRITICAL: Enable shipping address collection
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU"],
          },
          // Add shipping options
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 499, currency: "usd" },
                display_name: "Standard Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 10 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 1499, currency: "usd" },
                display_name: "Express Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 2 },
                  maximum: { unit: "business_day", value: 4 },
                },
              },
            },
          ],
          success_url: `${getBaseUrl()}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl()}/bougie-boutique`,
          // CRITICAL: Metadata for order tracking and fulfillment
          metadata: {
            productName: input.productName,
            tenant: input.tenant,
            source: "web",
            requiresFulfillment: "true",
            isGuestCheckout: "true",
            cartItemsJson: input.cartItems ? JSON.stringify(input.cartItems) : "",
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Stripe guest checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // Product checkout (for Bougie Boutique / Emilie's products)
  createProductCheckout: protectedProcedure
    .input(z.object({
      productName: z.string(),
      productDescription: z.string().optional(),
      priceInCents: z.number().min(100),
      quantity: z.number().min(1).default(1),
      productId: z.number().optional(),
      imageUrl: z.string().optional(),
      tenant: z.enum(["emilie", "kayden", "shop"]).default("shop"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: input.productName,
                  description: input.productDescription || undefined,
                  images: input.imageUrl ? [input.imageUrl] : undefined,
                },
                unit_amount: input.priceInCents,
              },
              quantity: input.quantity,
            },
          ],
          mode: "payment",
          // CRITICAL: Enable shipping address collection
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU"],
          },
          // Add shipping options
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 499, currency: "usd" },
                display_name: "Standard Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 10 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 1499, currency: "usd" },
                display_name: "Express Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 2 },
                  maximum: { unit: "business_day", value: 4 },
                },
              },
            },
          ],
          success_url: `${getBaseUrl()}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl()}/${input.tenant === "emilie" ? "emilie" : "shop"}`,
          // CRITICAL: Metadata for order tracking and fulfillment
          metadata: {
            userId: ctx.user.id,
            userEmail: ctx.user.email || "",
            productId: input.productId?.toString() || "",
            productName: input.productName,
            tenant: input.tenant,
            source: "web",
            requiresFulfillment: "true",
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Stripe product checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product checkout session",
        });
      }
    }),

  // Digital product checkout (instant download, no shipping)
  createDigitalCheckout: protectedProcedure
    .input(z.object({
      productName: z.string(),
      productDescription: z.string().optional(),
      priceInCents: z.number().min(100),
      productId: z.number(),
      downloadUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: input.productName,
                  description: input.productDescription || "Digital Download",
                },
                unit_amount: input.priceInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          // No shipping for digital products
          success_url: `${getBaseUrl()}/download?session_id={CHECKOUT_SESSION_ID}&product=${input.productId}`,
          cancel_url: `${getBaseUrl()}/shop`,
          metadata: {
            userId: ctx.user.id,
            userEmail: ctx.user.email || "",
            productId: input.productId.toString(),
            productName: input.productName,
            tenant: "shop",
            source: "web",
            isDigital: "true",
            downloadUrl: input.downloadUrl || "",
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Stripe digital checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create digital checkout session",
        });
      }
    }),

  // Cart checkout (multiple items)
  createCartCheckout: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        priceInCents: z.number().min(100),
        quantity: z.number().min(1),
        productId: z.number().optional(),
        imageUrl: z.string().optional(),
      })),
      tenant: z.enum(["emilie", "kayden", "shop"]).default("shop"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const lineItems = input.items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description || undefined,
              images: item.imageUrl ? [item.imageUrl] : undefined,
            },
            unit_amount: item.priceInCents,
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || undefined,
          line_items: lineItems,
          mode: "payment",
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "AU"],
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 499, currency: "usd" },
                display_name: "Standard Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 10 },
                },
              },
            },
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 1499, currency: "usd" },
                display_name: "Express Shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 2 },
                  maximum: { unit: "business_day", value: 4 },
                },
              },
            },
          ],
          success_url: `${getBaseUrl()}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl()}/${input.tenant === "emilie" ? "emilie" : "shop"}`,
          metadata: {
            userId: ctx.user.id,
            userEmail: ctx.user.email || "",
            itemCount: input.items.length.toString(),
            tenant: input.tenant,
            source: "web",
            requiresFulfillment: "true",
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Stripe cart checkout error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create cart checkout session",
        });
      }
    }),

  // Get checkout session details (for order success page)
  getCheckoutSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["line_items", "customer", "shipping_details"],
        });

        return {
          id: session.id,
          status: session.status,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email || session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
          shippingDetails: (session as any).shipping_details,
          metadata: session.metadata,
          lineItems: session.line_items?.data.map(item => ({
            name: item.description,
            quantity: item.quantity,
            amount: item.amount_total,
          })),
        };
      } catch (error) {
        console.error("Get checkout session error:", error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Checkout session not found",
        });
      }
    }),

  getSubscriptionStatus: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const customers = await stripe.customers.search({
          query: `email:'${ctx.user.email}'`,
          limit: 1,
        });

        if (customers.data.length === 0) {
          return { hasSubscription: false, tier: "free" };
        }

        const customer = customers.data[0];
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return { hasSubscription: false, tier: "free" };
        }

        const subscription = subscriptions.data[0];
        return {
          hasSubscription: true,
          tier: subscription.metadata.tier || "starter",
          status: subscription.status,
          currentPeriodEnd: (subscription as any).current_period_end * 1000,
        };
      } catch (error) {
        console.error("Stripe subscription status error:", error);
        return { hasSubscription: false, tier: "free" };
      }
    }),

  cancelSubscription: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        const customers = await stripe.customers.search({
          query: `email:'${ctx.user.email}'`,
          limit: 1,
        });

        if (customers.data.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No subscription found",
          });
        }

        const customer = customers.data[0];
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No active subscription found",
          });
        }

        const subscription = subscriptions.data[0];
        await stripe.subscriptions.cancel(subscription.id);

        return { success: true };
      } catch (error) {
        console.error("Stripe cancel subscription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel subscription",
        });
      }
    }),
});
