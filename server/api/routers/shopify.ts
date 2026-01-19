import { z } from "zod";
import { router, protectedProcedure } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";

export const shopifyRouter = router({
  // Sync products from Shopify to local database
  syncProducts: protectedProcedure
    .input(z.object({
      shopDomain: z.string(),
      accessToken: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await fetch(
          `https://${input.shopDomain}/admin/api/2024-01/products.json`,
          {
            headers: {
              "X-Shopify-Access-Token": input.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products from Shopify");
        }

        const data = await response.json();
        const { createProduct } = await import("../../db");

        const syncedProducts = [];
        for (const product of data.products) {
          const localProduct = await createProduct({
            userId: ctx.user.id,
            name: product.title,
            description: product.body_html || "",
            price: parseFloat(product.variants[0]?.price || "0"),
            imageUrl: product.images[0]?.src || "",
          });
          syncedProducts.push(localProduct);
        }

        return {
          success: true,
          count: syncedProducts.length,
          products: syncedProducts,
        };
      } catch (error) {
        console.error("Shopify sync error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sync products from Shopify",
        });
      }
    }),

  // Get Shopify store info
  getStoreInfo: protectedProcedure
    .input(z.object({
      shopDomain: z.string(),
      accessToken: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(
          `https://${input.shopDomain}/admin/api/2024-01/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": input.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch store info");
        }

        const data = await response.json();
        return {
          name: data.shop.name,
          email: data.shop.email,
          domain: data.shop.domain,
          currency: data.shop.currency,
        };
      } catch (error) {
        console.error("Shopify store info error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch store information",
        });
      }
    }),

  // Update inventory in Shopify
  updateInventory: protectedProcedure
    .input(z.object({
      shopDomain: z.string(),
      accessToken: z.string(),
      variantId: z.string(),
      quantity: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          `https://${input.shopDomain}/admin/api/2024-01/inventory_levels/set.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": input.accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location_id: input.variantId,
              inventory_item_id: input.variantId,
              available: input.quantity,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update inventory");
        }

        return { success: true };
      } catch (error) {
        console.error("Shopify inventory update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update inventory",
        });
      }
    }),
});
