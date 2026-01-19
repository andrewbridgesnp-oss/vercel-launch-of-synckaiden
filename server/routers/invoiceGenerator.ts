import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { invoiceGenClients, invoiceGenInvoices, invoiceGenPayments } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const invoiceGeneratorRouter = router({
  // ============= CLIENT MANAGEMENT =============
  
  createClient: protectedProcedure
    .input(z.object({
      clientName: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      address: z.string().optional(),
      taxId: z.string().optional(),
      paymentTerms: z.number().default(30),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [client] = await db.insert(invoiceGenClients).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true, clientId: client.insertId };
    }),

  getClients: protectedProcedure
    .input(z.object({
      limit: z.number().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const clients = await db
        .select()
        .from(invoiceGenClients)
        .where(eq(invoiceGenClients.userId, ctx.user.id))
        .orderBy(desc(invoiceGenClients.createdAt))
        .limit(input.limit);
      
      return clients;
    }),

  updateClient: protectedProcedure
    .input(z.object({
      id: z.number(),
      clientName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      address: z.string().optional(),
      taxId: z.string().optional(),
      paymentTerms: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(invoiceGenClients)
        .set(updates)
        .where(and(
          eq(invoiceGenClients.id, id),
          eq(invoiceGenClients.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteClient: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(invoiceGenClients)
        .where(and(
          eq(invoiceGenClients.id, input.id),
          eq(invoiceGenClients.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= INVOICE MANAGEMENT =============
  
  createInvoice: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      invoiceNumber: z.string().min(1),
      issueDate: z.string(),
      dueDate: z.string(),
      lineItems: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        rate: z.number(),
        amount: z.number(),
      })),
      taxRate: z.number().default(0),
      notes: z.string().optional(),
      terms: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Calculate totals
      const subtotal = input.lineItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = Math.round(subtotal * (input.taxRate / 100));
      const total = subtotal + taxAmount;
      
      const [invoice] = await db.insert(invoiceGenInvoices).values({
        userId: ctx.user.id,
        clientId: input.clientId,
        invoiceNumber: input.invoiceNumber,
        issueDate: new Date(input.issueDate),
        dueDate: new Date(input.dueDate),
        subtotal,
        taxRate: input.taxRate.toString(),
        taxAmount,
        total,
        lineItems: JSON.stringify(input.lineItems),
        notes: input.notes,
        terms: input.terms,
      });
      
      return { success: true, invoiceId: invoice.insertId, total };
    }),

  getInvoices: protectedProcedure
    .input(z.object({
      status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
      clientId: z.number().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(invoiceGenInvoices.userId, ctx.user.id)];
      if (input.status) {
        conditions.push(eq(invoiceGenInvoices.status, input.status));
      }
      if (input.clientId) {
        conditions.push(eq(invoiceGenInvoices.clientId, input.clientId));
      }
      
      const invoices = await db
        .select()
        .from(invoiceGenInvoices)
        .where(and(...conditions))
        .orderBy(desc(invoiceGenInvoices.createdAt))
        .limit(input.limit);
      
      return invoices;
    }),

  getInvoiceById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [invoice] = await db
        .select()
        .from(invoiceGenInvoices)
        .where(and(
          eq(invoiceGenInvoices.id, input.id),
          eq(invoiceGenInvoices.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }
      
      return invoice;
    }),

  updateInvoice: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
      lineItems: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        rate: z.number(),
        amount: z.number(),
      })).optional(),
      taxRate: z.number().optional(),
      notes: z.string().optional(),
      terms: z.string().optional(),
      sentAt: z.string().optional(),
      paidAt: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      // Recalculate totals if line items changed
      let calculatedUpdates: any = { ...updates };
      if (updates.lineItems) {
        const subtotal = updates.lineItems.reduce((sum, item) => sum + item.amount, 0);
        const taxRate = updates.taxRate || 0;
        const taxAmount = Math.round(subtotal * (taxRate / 100));
        const total = subtotal + taxAmount;
        
        calculatedUpdates = {
          ...updates,
          lineItems: JSON.stringify(updates.lineItems),
          subtotal,
          taxRate: taxRate.toString(),
          taxAmount,
          total,
        };
      }
      
      if (updates.sentAt) {
        calculatedUpdates.sentAt = new Date(updates.sentAt);
      }
      if (updates.paidAt) {
        calculatedUpdates.paidAt = new Date(updates.paidAt);
      }
      
      await db
        .update(invoiceGenInvoices)
        .set(calculatedUpdates)
        .where(and(
          eq(invoiceGenInvoices.id, id),
          eq(invoiceGenInvoices.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteInvoice: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(invoiceGenInvoices)
        .where(and(
          eq(invoiceGenInvoices.id, input.id),
          eq(invoiceGenInvoices.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= PAYMENT TRACKING =============
  
  recordPayment: protectedProcedure
    .input(z.object({
      invoiceId: z.number(),
      amount: z.number(),
      paymentMethod: z.string(),
      paymentDate: z.string(),
      transactionId: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Get invoice to update amount paid
      const [invoice] = await db
        .select()
        .from(invoiceGenInvoices)
        .where(and(
          eq(invoiceGenInvoices.id, input.invoiceId),
          eq(invoiceGenInvoices.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }
      
      // Record payment
      const [payment] = await db.insert(invoiceGenPayments).values({
        userId: ctx.user.id,
        invoiceId: input.invoiceId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentDate: new Date(input.paymentDate),
        transactionId: input.transactionId,
        notes: input.notes,
      });
      
      // Update invoice amount paid and status
      const newAmountPaid = invoice.amountPaid + input.amount;
      const isPaid = newAmountPaid >= invoice.total;
      
      await db
        .update(invoiceGenInvoices)
        .set({
          amountPaid: newAmountPaid,
          status: isPaid ? "paid" : invoice.status,
          paidAt: isPaid ? new Date(input.paymentDate) : null,
        })
        .where(eq(invoiceGenInvoices.id, input.invoiceId));
      
      return { success: true, paymentId: payment.insertId, isPaid };
    }),

  getPayments: protectedProcedure
    .input(z.object({
      invoiceId: z.number().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(invoiceGenPayments.userId, ctx.user.id)];
      if (input.invoiceId) {
        conditions.push(eq(invoiceGenPayments.invoiceId, input.invoiceId));
      }
      
      const payments = await db
        .select()
        .from(invoiceGenPayments)
        .where(and(...conditions))
        .orderBy(desc(invoiceGenPayments.paymentDate))
        .limit(input.limit);
      
      return payments;
    }),

  // ============= ANALYTICS =============
  
  getInvoiceStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = getDb();
      
      const [stats] = await db
        .select({
          totalInvoices: sql<number>`COUNT(*)`,
          totalRevenue: sql<number>`SUM(${invoiceGenInvoices.total})`,
          totalPaid: sql<number>`SUM(${invoiceGenInvoices.amountPaid})`,
          totalOutstanding: sql<number>`SUM(${invoiceGenInvoices.total} - ${invoiceGenInvoices.amountPaid})`,
          draftCount: sql<number>`SUM(CASE WHEN ${invoiceGenInvoices.status} = 'draft' THEN 1 ELSE 0 END)`,
          sentCount: sql<number>`SUM(CASE WHEN ${invoiceGenInvoices.status} = 'sent' THEN 1 ELSE 0 END)`,
          paidCount: sql<number>`SUM(CASE WHEN ${invoiceGenInvoices.status} = 'paid' THEN 1 ELSE 0 END)`,
          overdueCount: sql<number>`SUM(CASE WHEN ${invoiceGenInvoices.status} = 'overdue' THEN 1 ELSE 0 END)`,
        })
        .from(invoiceGenInvoices)
        .where(eq(invoiceGenInvoices.userId, ctx.user.id));
      
      return stats || {
        totalInvoices: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        draftCount: 0,
        sentCount: 0,
        paidCount: 0,
        overdueCount: 0,
      };
    }),

  // ============= AI FEATURES =============
  
  generateInvoiceTerms: protectedProcedure
    .input(z.object({
      businessType: z.string(),
      paymentTerms: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a business attorney generating professional invoice terms and conditions that protect the service provider while being fair to clients.",
          },
          {
            role: "user",
            content: `Generate professional invoice terms and conditions for:\n\nBusiness Type: ${input.businessType}\nPayment Terms: Net ${input.paymentTerms} days\n\nInclude: Payment terms, late fees, dispute resolution, and liability limitations.`,
          },
        ],
      });

      const terms = response.choices[0]?.message?.content || "";
      return { terms };
    }),

  generateLineItemDescription: protectedProcedure
    .input(z.object({
      serviceType: z.string(),
      details: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter creating clear, professional invoice line item descriptions.",
          },
          {
            role: "user",
            content: `Create a professional invoice line item description for:\n\nService: ${input.serviceType}\nDetails: ${input.details}\n\nKeep it concise (1-2 sentences) and professional.`,
          },
        ],
      });

      const description = response.choices[0]?.message?.content || "";
      return { description };
    }),
});
