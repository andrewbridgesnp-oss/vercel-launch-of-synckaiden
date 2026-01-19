import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { orderManagementOrders, orderManagementItems } from "../../drizzle/schema.js";
import { eq, and, desc, sql, like, or, gte, lte } from "drizzle-orm";

export const orderManagementRouter = router({
  // ========== ORDERS ==========
  
  createOrder: protectedProcedure
    .input(z.object({
      customerName: z.string().min(1).max(255),
      customerEmail: z.string().email().max(320),
      customerPhone: z.string().max(20).optional(),
      shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
      }).optional(),
      items: z.array(z.object({
        productName: z.string().min(1).max(255),
        sku: z.string().max(100).optional(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().int().min(0),
      })).min(1),
      tax: z.number().int().min(0).default(0),
      shipping: z.number().int().min(0).default(0),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const total = subtotal + input.tax + input.shipping;
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create order
      const [order] = await db.insert(orderManagementOrders).values({
        userId: ctx.user.id,
        orderNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        subtotal,
        tax: input.tax,
        shipping: input.shipping,
        total,
        notes: input.notes,
      }).$returningId();
      
      // Create order items
      await db.insert(orderManagementItems).values(
        input.items.map(item => ({
          orderId: order.id,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.unitPrice * item.quantity,
        }))
      );
      
      return order;
    }),

  getOrders: protectedProcedure
    .input(z.object({
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
      search: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(orderManagementOrders.userId, ctx.user.id)];
      
      if (input?.status) {
        conditions.push(eq(orderManagementOrders.status, input.status));
      }
      if (input?.search) {
        conditions.push(or(
          like(orderManagementOrders.orderNumber, `%${input.search}%`),
          like(orderManagementOrders.customerName, `%${input.search}%`),
          like(orderManagementOrders.customerEmail, `%${input.search}%`)
        )!);
      }
      if (input?.startDate) {
        conditions.push(gte(orderManagementOrders.createdAt, input.startDate));
      }
      if (input?.endDate) {
        conditions.push(lte(orderManagementOrders.createdAt, input.endDate));
      }
      
      return await db.select().from(orderManagementOrders)
        .where(and(...conditions))
        .orderBy(desc(orderManagementOrders.createdAt))
        .limit(input?.limit || 50);
    }),

  getOrder: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [order] = await db.select().from(orderManagementOrders)
        .where(and(
          eq(orderManagementOrders.id, input.id),
          eq(orderManagementOrders.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!order) return null;
      
      // Get order items
      const items = await db.select().from(orderManagementItems)
        .where(eq(orderManagementItems.orderId, input.id));
      
      return { ...order, items };
    }),

  updateOrder: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
      customerName: z.string().min(1).max(255).optional(),
      customerEmail: z.string().email().max(320).optional(),
      customerPhone: z.string().max(20).optional(),
      shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
      }).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = getDb();
      await db.update(orderManagementOrders)
        .set(updates)
        .where(and(
          eq(orderManagementOrders.id, id),
          eq(orderManagementOrders.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  deleteOrder: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Delete items first
      await db.delete(orderManagementItems)
        .where(eq(orderManagementItems.orderId, input.id));
      // Delete order
      await db.delete(orderManagementOrders)
        .where(and(
          eq(orderManagementOrders.id, input.id),
          eq(orderManagementOrders.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ========== ORDER ITEMS ==========

  getOrderItems: protectedProcedure
    .input(z.object({ orderId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return await db.select().from(orderManagementItems)
        .where(eq(orderManagementItems.orderId, input.orderId));
    }),

  // ========== ANALYTICS ==========

  getAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(orderManagementOrders.userId, ctx.user.id)];
      
      if (input?.startDate) {
        conditions.push(gte(orderManagementOrders.createdAt, input.startDate));
      }
      if (input?.endDate) {
        conditions.push(lte(orderManagementOrders.createdAt, input.endDate));
      }
      
      const [stats] = await db.select({
        totalOrders: sql<number>`COUNT(*)`,
        pending: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'pending' THEN 1 ELSE 0 END)`,
        processing: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'processing' THEN 1 ELSE 0 END)`,
        shipped: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'shipped' THEN 1 ELSE 0 END)`,
        delivered: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'delivered' THEN 1 ELSE 0 END)`,
        cancelled: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'cancelled' THEN 1 ELSE 0 END)`,
        refunded: sql<number>`SUM(CASE WHEN ${orderManagementOrders.status} = 'refunded' THEN 1 ELSE 0 END)`,
        totalRevenue: sql<number>`COALESCE(SUM(${orderManagementOrders.total}), 0)`,
        avgOrderValue: sql<number>`COALESCE(AVG(${orderManagementOrders.total}), 0)`,
      }).from(orderManagementOrders)
        .where(and(...conditions));
      
      return stats;
    }),

  getRecentOrders: protectedProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(20).default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return await db.select().from(orderManagementOrders)
        .where(eq(orderManagementOrders.userId, ctx.user.id))
        .orderBy(desc(orderManagementOrders.createdAt))
        .limit(input?.limit || 10);
    }),
});
