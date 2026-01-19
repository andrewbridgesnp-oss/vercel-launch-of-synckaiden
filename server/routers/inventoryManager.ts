import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { inventoryProducts, inventoryMovements } from "../../drizzle/schema.js";
import { eq, and, desc, sql, like, or, lt } from "drizzle-orm";

export const inventoryManagerRouter = router({
  // ========== PRODUCTS ==========
  
  createProduct: protectedProcedure
    .input(z.object({
      sku: z.string().min(1).max(100),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.string().max(100).optional(),
      currentStock: z.number().int().min(0).default(0),
      minStock: z.number().int().min(0).default(0),
      maxStock: z.number().int().min(0).optional(),
      unitCost: z.number().int().min(0).optional(),
      unitPrice: z.number().int().min(0).optional(),
      location: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [product] = await db.insert(inventoryProducts).values({
        userId: ctx.user.id,
        ...input,
      }).$returningId();
      return product;
    }),

  getProducts: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      lowStock: z.boolean().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(inventoryProducts.userId, ctx.user.id)];
      
      if (input?.category) {
        conditions.push(eq(inventoryProducts.category, input.category));
      }
      if (input?.search) {
        conditions.push(or(
          like(inventoryProducts.name, `%${input.search}%`),
          like(inventoryProducts.sku, `%${input.search}%`)
        )!);
      }
      if (input?.lowStock) {
        conditions.push(sql`${inventoryProducts.currentStock} <= ${inventoryProducts.minStock}`);
      }
      
      return await db.select().from(inventoryProducts)
        .where(and(...conditions))
        .orderBy(desc(inventoryProducts.createdAt))
        .limit(input?.limit || 50);
    }),

  getProduct: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [product] = await db.select().from(inventoryProducts)
        .where(and(
          eq(inventoryProducts.id, input.id),
          eq(inventoryProducts.userId, ctx.user.id)
        ))
        .limit(1);
      return product;
    }),

  updateProduct: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      sku: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      category: z.string().max(100).optional(),
      minStock: z.number().int().min(0).optional(),
      maxStock: z.number().int().min(0).optional(),
      unitCost: z.number().int().min(0).optional(),
      unitPrice: z.number().int().min(0).optional(),
      location: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      await db.update(inventoryProducts)
        .set(updates)
        .where(and(
          eq(inventoryProducts.id, id),
          eq(inventoryProducts.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(inventoryProducts)
        .where(and(
          eq(inventoryProducts.id, input.id),
          eq(inventoryProducts.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== INVENTORY MOVEMENTS ==========

  recordMovement: protectedProcedure
    .input(z.object({
      productId: z.number().int(),
      type: z.enum(["purchase", "sale", "adjustment", "return", "transfer"]),
      quantity: z.number().int(),
      reference: z.string().max(255).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Record movement
      const [movement] = await db.insert(inventoryMovements).values({
        userId: ctx.user.id,
        ...input,
      }).$returningId();
      
      // Update product stock
      const [product] = await db.select().from(inventoryProducts)
        .where(eq(inventoryProducts.id, input.productId))
        .limit(1);
      
      let newStock = product.currentStock;
      if (input.type === "purchase" || input.type === "return") {
        newStock += input.quantity;
      } else if (input.type === "sale" || input.type === "transfer") {
        newStock -= input.quantity;
      } else if (input.type === "adjustment") {
        newStock = input.quantity; // Adjustment sets absolute value
      }
      
      await db.update(inventoryProducts)
        .set({ currentStock: Math.max(0, newStock) })
        .where(eq(inventoryProducts.id, input.productId));
      
      return movement;
    }),

  getMovements: protectedProcedure
    .input(z.object({
      productId: z.number().int().optional(),
      type: z.enum(["purchase", "sale", "adjustment", "return", "transfer"]).optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(inventoryMovements.userId, ctx.user.id)];
      
      if (input?.productId) {
        conditions.push(eq(inventoryMovements.productId, input.productId));
      }
      if (input?.type) {
        conditions.push(eq(inventoryMovements.type, input.type));
      }
      
      return await db.select().from(inventoryMovements)
        .where(and(...conditions))
        .orderBy(desc(inventoryMovements.createdAt))
        .limit(input?.limit || 50);
    }),

  // ========== ANALYTICS ==========

  getAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const [stats] = await db.select({
        totalProducts: sql<number>`COUNT(*)`,
        totalValue: sql<number>`COALESCE(SUM(${inventoryProducts.currentStock} * ${inventoryProducts.unitCost}), 0)`,
        lowStockCount: sql<number>`SUM(CASE WHEN ${inventoryProducts.currentStock} <= ${inventoryProducts.minStock} THEN 1 ELSE 0 END)`,
        outOfStockCount: sql<number>`SUM(CASE WHEN ${inventoryProducts.currentStock} = 0 THEN 1 ELSE 0 END)`,
      }).from(inventoryProducts)
        .where(eq(inventoryProducts.userId, ctx.user.id));
      
      return stats;
    }),

  getLowStockAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      return await db.select().from(inventoryProducts)
        .where(and(
          eq(inventoryProducts.userId, ctx.user.id),
          sql`${inventoryProducts.currentStock} <= ${inventoryProducts.minStock}`
        ))
        .orderBy(inventoryProducts.currentStock)
        .limit(20);
    }),
});
