import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  boutiqueProducts, boutiqueCart, boutiqueOrders, boutiqueOrderItems,
  sigmaProducts, sigmaCart, sigmaOrders, sigmaOrderItems 
} from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Apparel Stores Router
 * Handles both Bougie Boutique (children's mental health) and Sigma Strength Co. (men's mental health)
 */

export const apparelRouter = router({
  // ============= BOUGIE BOUTIQUE PROCEDURES =============
  
  getBoutiqueProducts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const filters = [eq(boutiqueProducts.active, true)];
      if (input?.category) {
        filters.push(eq(boutiqueProducts.category, input.category));
      }
      
      return await db.select()
        .from(boutiqueProducts)
        .where(and(...filters))
        .limit(input?.limit || 50)
        .orderBy(desc(boutiqueProducts.createdAt));
    }),

  getBoutiqueProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [product] = await db.select()
        .from(boutiqueProducts)
        .where(eq(boutiqueProducts.id, input.id))
        .limit(1);
      
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      return product;
    }),

  addToBoutiqueCart: protectedProcedure
    .input(z.object({
      productId: z.number(),
      variantId: z.string().optional(),
      quantity: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check if item already exists in cart
      const [existing] = await db.select()
        .from(boutiqueCart)
        .where(and(
          eq(boutiqueCart.userId, ctx.user.id),
          eq(boutiqueCart.productId, input.productId),
          input.variantId ? eq(boutiqueCart.variantId, input.variantId) : eq(boutiqueCart.variantId, null)
        ))
        .limit(1);

      if (existing) {
        // Update quantity
        await db.update(boutiqueCart)
          .set({ 
            quantity: existing.quantity + input.quantity,
            updatedAt: new Date()
          })
          .where(eq(boutiqueCart.id, existing.id));
        
        return { success: true, message: "Cart updated" };
      }

      // Add new item
      await db.insert(boutiqueCart).values({
        userId: ctx.user.id,
        productId: input.productId,
        variantId: input.variantId || null,
        quantity: input.quantity,
      });

      return { success: true, message: "Added to cart" };
    }),

  getBoutiqueCart: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const cartItems = await db.select({
        id: boutiqueCart.id,
        quantity: boutiqueCart.quantity,
        variantId: boutiqueCart.variantId,
        product: boutiqueProducts,
      })
        .from(boutiqueCart)
        .leftJoin(boutiqueProducts, eq(boutiqueCart.productId, boutiqueProducts.id))
        .where(eq(boutiqueCart.userId, ctx.user.id));

      return cartItems;
    }),

  updateBoutiqueCartQuantity: protectedProcedure
    .input(z.object({
      cartItemId: z.number(),
      quantity: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      if (input.quantity === 0) {
        await db.delete(boutiqueCart)
          .where(and(
            eq(boutiqueCart.id, input.cartItemId),
            eq(boutiqueCart.userId, ctx.user.id)
          ));
        return { success: true, message: "Item removed from cart" };
      }

      await db.update(boutiqueCart)
        .set({ quantity: input.quantity, updatedAt: new Date() })
        .where(and(
          eq(boutiqueCart.id, input.cartItemId),
          eq(boutiqueCart.userId, ctx.user.id)
        ));

      return { success: true, message: "Cart updated" };
    }),

  removeBoutiqueCartItem: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      await db.delete(boutiqueCart)
        .where(and(
          eq(boutiqueCart.id, input.cartItemId),
          eq(boutiqueCart.userId, ctx.user.id)
        ));

      return { success: true, message: "Item removed from cart" };
    }),

  // ============= SIGMA STRENGTH CO. PROCEDURES =============
  
  getSigmaProducts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const filters = [eq(sigmaProducts.active, true)];
      if (input?.category) {
        filters.push(eq(sigmaProducts.category, input.category));
      }
      
      return await db.select()
        .from(sigmaProducts)
        .where(and(...filters))
        .limit(input?.limit || 50)
        .orderBy(desc(sigmaProducts.createdAt));
    }),

  getSigmaProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [product] = await db.select()
        .from(sigmaProducts)
        .where(eq(sigmaProducts.id, input.id))
        .limit(1);
      
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      return product;
    }),

  addToSigmaCart: protectedProcedure
    .input(z.object({
      productId: z.number(),
      variantId: z.string().optional(),
      quantity: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [existing] = await db.select()
        .from(sigmaCart)
        .where(and(
          eq(sigmaCart.userId, ctx.user.id),
          eq(sigmaCart.productId, input.productId),
          input.variantId ? eq(sigmaCart.variantId, input.variantId) : eq(sigmaCart.variantId, null)
        ))
        .limit(1);

      if (existing) {
        await db.update(sigmaCart)
          .set({ 
            quantity: existing.quantity + input.quantity,
            updatedAt: new Date()
          })
          .where(eq(sigmaCart.id, existing.id));
        
        return { success: true, message: "Cart updated" };
      }

      await db.insert(sigmaCart).values({
        userId: ctx.user.id,
        productId: input.productId,
        variantId: input.variantId || null,
        quantity: input.quantity,
      });

      return { success: true, message: "Added to cart" };
    }),

  getSigmaCart: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const cartItems = await db.select({
        id: sigmaCart.id,
        quantity: sigmaCart.quantity,
        variantId: sigmaCart.variantId,
        product: sigmaProducts,
      })
        .from(sigmaCart)
        .leftJoin(sigmaProducts, eq(sigmaCart.productId, sigmaProducts.id))
        .where(eq(sigmaCart.userId, ctx.user.id));

      return cartItems;
    }),

  updateSigmaCartQuantity: protectedProcedure
    .input(z.object({
      cartItemId: z.number(),
      quantity: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      if (input.quantity === 0) {
        await db.delete(sigmaCart)
          .where(and(
            eq(sigmaCart.id, input.cartItemId),
            eq(sigmaCart.userId, ctx.user.id)
          ));
        return { success: true, message: "Item removed from cart" };
      }

      await db.update(sigmaCart)
        .set({ quantity: input.quantity, updatedAt: new Date() })
        .where(and(
          eq(sigmaCart.id, input.cartItemId),
          eq(sigmaCart.userId, ctx.user.id)
        ));

      return { success: true, message: "Cart updated" };
    }),

  removeSigmaCartItem: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      await db.delete(sigmaCart)
        .where(and(
          eq(sigmaCart.id, input.cartItemId),
          eq(sigmaCart.userId, ctx.user.id)
        ));

      return { success: true, message: "Item removed from cart" };
    }),

  // ============= ORDER MANAGEMENT (BOTH STORES) =============

  getBoutiqueOrders: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      return await db.select()
        .from(boutiqueOrders)
        .where(eq(boutiqueOrders.userId, ctx.user.id))
        .orderBy(desc(boutiqueOrders.createdAt));
    }),

  getSigmaOrders: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      return await db.select()
        .from(sigmaOrders)
        .where(eq(sigmaOrders.userId, ctx.user.id))
        .orderBy(desc(sigmaOrders.createdAt));
    }),

  getBoutiqueOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [order] = await db.select()
        .from(boutiqueOrders)
        .where(and(
          eq(boutiqueOrders.id, input.orderId),
          eq(boutiqueOrders.userId, ctx.user.id)
        ))
        .limit(1);

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const items = await db.select({
        id: boutiqueOrderItems.id,
        quantity: boutiqueOrderItems.quantity,
        unitPrice: boutiqueOrderItems.unitPrice,
        totalPrice: boutiqueOrderItems.totalPrice,
        variantId: boutiqueOrderItems.variantId,
        product: boutiqueProducts,
      })
        .from(boutiqueOrderItems)
        .leftJoin(boutiqueProducts, eq(boutiqueOrderItems.productId, boutiqueProducts.id))
        .where(eq(boutiqueOrderItems.orderId, input.orderId));

      return { ...order, items };
    }),

  getSigmaOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [order] = await db.select()
        .from(sigmaOrders)
        .where(and(
          eq(sigmaOrders.id, input.orderId),
          eq(sigmaOrders.userId, ctx.user.id)
        ))
        .limit(1);

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const items = await db.select({
        id: sigmaOrderItems.id,
        quantity: sigmaOrderItems.quantity,
        unitPrice: sigmaOrderItems.unitPrice,
        totalPrice: sigmaOrderItems.totalPrice,
        variantId: sigmaOrderItems.variantId,
        product: sigmaProducts,
      })
        .from(sigmaOrderItems)
        .leftJoin(sigmaProducts, eq(sigmaOrderItems.productId, sigmaProducts.id))
        .where(eq(sigmaOrderItems.orderId, input.orderId));

      return { ...order, items };
    }),
});
