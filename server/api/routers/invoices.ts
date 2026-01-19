import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../_core/trpc";
import { getDb } from "../../db";
import { invoices } from "../../../drizzle/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import stripe from "stripe";
import { ENV } from "../../_core/env";

export const invoicesRouter = router({
  // List all invoices for workspace
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const results = await db
        .select()
        .from(invoices)
        .where(eq(invoices.workspaceId, input.workspaceId))
        .orderBy(desc(invoices.createdAt));

      return results;
    }),

  // Get single invoice
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }

      return result[0];
    }),

  // Create invoice
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        clientName: z.string(),
        clientEmail: z.string().email(),
        clientAddress: z.string().optional(),
        invoiceNumber: z.string(),
        items: z.array(
          z.object({
            description: z.string(),
            quantity: z.number(),
            rate: z.number(),
            amount: z.number(),
          })
        ),
        subtotal: z.number(),
        taxRate: z.number().default(0),
        taxAmount: z.number().default(0),
        total: z.number(),
        dueDate: z.string(),
        notes: z.string().optional(),
        recurring: z.boolean().default(false),
        recurringInterval: z.enum(["weekly", "monthly", "quarterly", "yearly"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(invoices).values({
        workspaceId: input.workspaceId,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        invoiceNumber: input.invoiceNumber,
        items: input.items,
        amount: input.subtotal,
        tax: input.taxAmount,
        total: input.total,
        dueDate: new Date(input.dueDate),
        status: "draft",
        notes: input.notes,
      });

      const invoiceId = Number(result[0].insertId);

      return { id: invoiceId };
    }),

  // Update invoice
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        clientName: z.string().optional(),
        clientEmail: z.string().email().optional(),
        clientAddress: z.string().optional(),
        items: z
          .array(
            z.object({
              description: z.string(),
              quantity: z.number(),
              rate: z.number(),
              amount: z.number(),
            })
          )
          .optional(),
        subtotal: z.number().optional(),
        taxRate: z.number().optional(),
        taxAmount: z.number().optional(),
        total: z.number().optional(),
        dueDate: z.string().optional(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { id, dueDate, ...updates } = input;

      const updateData: any = { ...updates };
      if (dueDate) {
        updateData.dueDate = new Date(dueDate);
      }

      await db.update(invoices).set(updateData).where(eq(invoices.id, id));

      return { success: true };
    }),

  // Send invoice via email
  send: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const invoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.id))
        .limit(1);

      if (invoice.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }

      // Update status to sent
      await db
        .update(invoices)
        .set({
          status: "sent",
        })
        .where(eq(invoices.id, input.id));

      // TODO: Implement email sending via email service
      // For now, just mark as sent

      return { success: true };
    }),

  // Create Stripe payment intent for invoice
  createPaymentIntent: protectedProcedure
    .input(z.object({ invoiceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const invoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.invoiceId))
        .limit(1);

      if (invoice.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }

      const inv = invoice[0];

      try {
        const stripeClient = new stripe(ENV.stripeSecretKey);

        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: Math.round(inv.total * 100), // Convert to cents
          currency: "usd",
          metadata: {
            invoiceId: String(inv.id),
            invoiceNumber: inv.invoiceNumber,
            workspaceId: String(inv.workspaceId),
          },
          description: `Invoice ${inv.invoiceNumber} - ${inv.clientName}`,
        });

        // Update invoice with Stripe invoice ID
        await db
          .update(invoices)
          .set({
            stripeInvoiceId: paymentIntent.id,
          })
          .where(eq(invoices.id, input.invoiceId));

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create payment intent: ${error}`,
        });
      }
    }),

  // Mark invoice as paid
  markPaid: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        paymentMethod: z.string().optional(),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(invoices)
        .set({
          status: "paid",
          paidAt: new Date(),
        })
        .where(eq(invoices.id, input.id));

      return { success: true };
    }),

  // Generate next invoice number
  getNextInvoiceNumber: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const lastInvoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.workspaceId, input.workspaceId))
        .orderBy(desc(invoices.id))
        .limit(1);

      if (lastInvoice.length === 0) {
        return `INV-${new Date().getFullYear()}-0001`;
      }

      // Extract number from last invoice and increment
      const lastNumber = lastInvoice[0].invoiceNumber;
      const match = lastNumber.match(/(\d+)$/);
      const nextNum = match ? parseInt(match[1]) + 1 : 1;

      return `INV-${new Date().getFullYear()}-${String(nextNum).padStart(4, "0")}`;
    }),

  // Get overdue invoices
  getOverdue: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const today = new Date();

      const results = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.workspaceId, input.workspaceId),
            eq(invoices.status, "sent"),
            lte(invoices.dueDate, today)
          )
        )
        .orderBy(invoices.dueDate);

      return results;
    }),

  // Get invoice analytics
  getAnalytics: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const allInvoices = await db
        .select()
        .from(invoices)
        .where(eq(invoices.workspaceId, input.workspaceId));

      const totalInvoiced = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const totalPaid = allInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.total, 0);
      const totalOutstanding = allInvoices
        .filter((inv) => inv.status === "sent")
        .reduce((sum, inv) => sum + inv.total, 0);
      const totalOverdue = allInvoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.total, 0);

      return {
        totalInvoiced,
        totalPaid,
        totalOutstanding,
        totalOverdue,
        invoiceCount: allInvoices.length,
        paidCount: allInvoices.filter((inv) => inv.status === "paid").length,
        outstandingCount: allInvoices.filter((inv) => inv.status === "sent").length,
        overdueCount: allInvoices.filter((inv) => inv.status === "overdue").length,
      };
    }),

  // Delete invoice
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(invoices).where(eq(invoices.id, input.id));

      return { success: true };
    }),
});
