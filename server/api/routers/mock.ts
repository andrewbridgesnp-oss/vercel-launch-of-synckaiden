/**
 * Mock Router - Provides mock data for Phase 1-2 functionality
 * All procedures work with in-memory data when MOCK_MODE is enabled
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  MOCK_MODE,
  mockDataStore,
  generateMockAIResponse,
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateId,
  checkRateLimit,
} from "../../mockData";

// ============ DASHBOARD ROUTER ============

export const dashboardRouter = router({
  getStats: publicProcedure.query(() => {
    if (!MOCK_MODE) {
      console.log('[Dashboard] Real mode - would fetch from database');
    }
    return mockDataStore.getDashboardStats();
  }),

  getRecentActivities: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(({ input }) => {
      return mockDataStore.getActivities(input.limit);
    }),
});

// ============ CONTACTS/CRM MOCK ROUTER ============

export const contactsMockRouter = router({
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      status: z.enum(['all', 'lead', 'prospect', 'customer', 'inactive']).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(({ input }) => {
      const filters = {
        search: input?.search ? sanitizeInput(input.search) : undefined,
        status: input?.status,
        sortBy: input?.sortBy,
        sortOrder: input?.sortOrder,
      };
      const contacts = mockDataStore.getContacts(filters);
      return {
        contacts: contacts.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 50)),
        total: contacts.length,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });
      
      const contact = mockDataStore.getContactById(id);
      if (!contact) throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
      return contact;
    }),

  create: publicProcedure
    .input(z.object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email().max(254),
      phone: z.string().max(20).optional(),
      company: z.string().max(200).optional(),
      jobTitle: z.string().max(100).optional(),
      status: z.enum(['lead', 'prospect', 'customer', 'inactive']).default('lead'),
      tags: z.array(z.string().max(50)).max(10).default([]),
      notes: z.string().max(5000).optional(),
    }))
    .mutation(({ input, ctx }) => {
      // Rate limiting
      const clientKey = ctx.req?.ip || 'anonymous';
      if (!checkRateLimit(`create-contact:${clientKey}`, 30, 60000)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
      }

      // Validate email
      if (!validateEmail(input.email)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid email format' });
      }

      // Validate phone if provided
      if (input.phone && !validatePhone(input.phone)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid phone format' });
      }

      // Sanitize inputs
      const sanitizedData = {
        firstName: sanitizeInput(input.firstName),
        lastName: sanitizeInput(input.lastName),
        email: input.email.toLowerCase().trim(),
        phone: input.phone ? sanitizeInput(input.phone) : undefined,
        company: input.company ? sanitizeInput(input.company) : undefined,
        jobTitle: input.jobTitle ? sanitizeInput(input.jobTitle) : undefined,
        status: input.status,
        tags: input.tags.map(t => sanitizeInput(t)),
        notes: input.notes ? sanitizeInput(input.notes) : undefined,
      };

      console.log('[Mock] Creating contact:', sanitizedData.email);
      return mockDataStore.createContact(sanitizedData);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      email: z.string().email().max(254).optional(),
      phone: z.string().max(20).optional(),
      company: z.string().max(200).optional(),
      jobTitle: z.string().max(100).optional(),
      status: z.enum(['lead', 'prospect', 'customer', 'inactive']).optional(),
      tags: z.array(z.string().max(50)).max(10).optional(),
      notes: z.string().max(5000).optional(),
    }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      const { id: _, ...updateData } = input;
      
      // Sanitize all string inputs
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(updateData)) {
        if (value === undefined) continue;
        if (typeof value === 'string') {
          sanitized[key] = key === 'email' ? value.toLowerCase().trim() : sanitizeInput(value);
        } else if (Array.isArray(value)) {
          sanitized[key] = value.map(v => typeof v === 'string' ? sanitizeInput(v) : v);
        } else {
          sanitized[key] = value;
        }
      }

      console.log('[Mock] Updating contact:', id);
      const updated = mockDataStore.updateContact(id, sanitized);
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Deleting contact:', id);
      const deleted = mockDataStore.deleteContact(id);
      if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
      return { success: true };
    }),

  getStats: publicProcedure.query(() => {
    return mockDataStore.getContactStats();
  }),

  export: publicProcedure.query(() => {
    const contacts = mockDataStore.getContacts();
    // Generate CSV
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Status', 'Tags'];
    const rows = contacts.map(c => [
      c.firstName,
      c.lastName,
      c.email,
      c.phone || '',
      c.company || '',
      c.status,
      c.tags.join(';'),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    return { csv, count: contacts.length };
  }),
});

// ============ LEADS ROUTER ============

export const leadsMockRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.enum(['all', 'new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
      search: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      return mockDataStore.getLeads({
        status: input?.status,
        search: input?.search ? sanitizeInput(input.search) : undefined,
      });
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      email: z.string().email().max(254),
      phone: z.string().max(20).optional(),
      source: z.string().max(100),
      status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).default('new'),
      score: z.number().min(0).max(100).default(50),
      assignedTo: z.string().max(100).optional(),
      notes: z.string().max(5000).optional(),
    }))
    .mutation(({ input }) => {
      console.log('[Mock] Creating lead:', input.email);
      return mockDataStore.createLead({
        name: sanitizeInput(input.name),
        email: input.email.toLowerCase().trim(),
        phone: input.phone ? sanitizeInput(input.phone) : undefined,
        source: sanitizeInput(input.source),
        status: input.status,
        score: input.score,
        assignedTo: input.assignedTo ? sanitizeInput(input.assignedTo) : undefined,
        notes: input.notes ? sanitizeInput(input.notes) : undefined,
      });
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
    }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Updating lead status:', id, input.status);
      const updated = mockDataStore.updateLead(id, { status: input.status });
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Lead not found' });
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Deleting lead:', id);
      const deleted = mockDataStore.deleteLead(id);
      if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Lead not found' });
      return { success: true };
    }),
});

// ============ EMPLOYEES ROUTER ============

export const employeesMockRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.enum(['all', 'active', 'inactive', 'on_leave']).optional(),
      department: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      return mockDataStore.getEmployees({
        status: input?.status,
        department: input?.department,
      });
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(200),
      email: z.string().email().max(254),
      phone: z.string().max(20).optional(),
      department: z.string().max(100),
      position: z.string().max(100),
      status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
      hireDate: z.string().transform(s => new Date(s)),
      salary: z.number().min(0).optional(),
    }))
    .mutation(({ input }) => {
      console.log('[Mock] Creating employee:', input.email);
      return mockDataStore.createEmployee({
        name: sanitizeInput(input.name),
        email: input.email.toLowerCase().trim(),
        phone: input.phone ? sanitizeInput(input.phone) : undefined,
        department: sanitizeInput(input.department),
        position: sanitizeInput(input.position),
        status: input.status,
        hireDate: input.hireDate,
        salary: input.salary,
      });
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['active', 'inactive', 'on_leave']),
    }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Updating employee status:', id, input.status);
      const updated = mockDataStore.updateEmployee(id, { status: input.status });
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' });
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Deleting employee:', id);
      const deleted = mockDataStore.deleteEmployee(id);
      if (!deleted) throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' });
      return { success: true };
    }),
});

// ============ INVENTORY ROUTER ============

export const inventoryMockRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.enum(['all', 'in_stock', 'low_stock', 'out_of_stock']).optional(),
      category: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      return mockDataStore.getInventory({
        status: input?.status,
        category: input?.category,
      });
    }),

  updateQuantity: publicProcedure
    .input(z.object({
      id: z.number(),
      quantity: z.number().min(0),
    }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Updating inventory quantity:', id, input.quantity);
      const updated = mockDataStore.updateInventoryQuantity(id, input.quantity);
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Item not found' });
      return updated;
    }),
});

// ============ ORDERS MOCK ROUTER ============

export const ordersMockRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.enum(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
    }).optional())
    .query(({ input }) => {
      return mockDataStore.getOrders({ status: input?.status });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      const order = mockDataStore.getOrderById(id);
      if (!order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
      return order;
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    }))
    .mutation(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      console.log('[Mock] Updating order status:', id, input.status);
      
      // Mock external calls
      if (input.status === 'refunded') {
        console.log('[Mock] Would call Stripe refund API');
      }
      if (input.status === 'shipped') {
        console.log('[Mock] Would call Printful fulfillment API');
        console.log('[Mock] Would send shipping notification email');
      }

      const updated = mockDataStore.updateOrderStatus(id, input.status);
      if (!updated) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
      return updated;
    }),

  // Mock checkout for Bougie Boutique
  createCheckout: publicProcedure
    .input(z.object({
      customerName: z.string().min(1).max(200),
      customerEmail: z.string().email().max(254),
      items: z.array(z.object({
        name: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })),
      shippingAddress: z.string().max(500).optional(),
    }))
    .mutation(({ input }) => {
      console.log('[Mock] Creating checkout - would call Stripe in real mode');
      
      const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const order = mockDataStore.createOrder({
        customerName: sanitizeInput(input.customerName),
        customerEmail: input.customerEmail.toLowerCase().trim(),
        items: input.items,
        total,
        status: 'pending',
        shippingAddress: input.shippingAddress ? sanitizeInput(input.shippingAddress) : undefined,
      });

      // Mock Stripe session
      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        checkoutUrl: `/order-success?mock=true&orderId=${order.id}`,
        total,
      };
    }),
});

// ============ CHAT MOCK ROUTER ============

export const chatMockRouter = router({
  getConversations: publicProcedure.query(({ ctx }) => {
    const userId = ctx.user?.id || 1; // Default to mock user
    return mockDataStore.getConversations(userId);
  }),

  getConversation: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const id = validateId(input.id);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid ID' });

      const conversation = mockDataStore.getConversationById(id);
      if (!conversation) throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' });
      return conversation;
    }),

  createConversation: publicProcedure
    .input(z.object({ title: z.string().min(1).max(200) }))
    .mutation(({ input, ctx }) => {
      const userId = ctx.user?.id || 1;
      console.log('[Mock] Creating conversation:', input.title);
      return mockDataStore.createConversation(userId, sanitizeInput(input.title));
    }),

  sendMessage: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string().min(1).max(10000),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = validateId(input.conversationId);
      if (!id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid conversation ID' });

      // Rate limiting for chat
      const clientKey = ctx.req?.ip || 'anonymous';
      if (!checkRateLimit(`chat:${clientKey}`, 20, 60000)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
      }

      const sanitizedContent = sanitizeInput(input.content);
      
      // Add user message
      const userMessage = mockDataStore.addMessage(id, 'user', sanitizedContent);
      
      console.log('[Mock] Would call LLM API in real mode');
      
      // Generate mock AI response
      const aiResponse = generateMockAIResponse(sanitizedContent);
      
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add assistant message
      const assistantMessage = mockDataStore.addMessage(id, 'assistant', aiResponse);
      
      return {
        userMessage,
        assistantMessage,
      };
    }),
});

// ============ MOCK AUTH ROUTER ============

export const mockAuthRouter = router({
  getMockUser: publicProcedure.query(() => {
    console.log('[Mock] Returning mock user session');
    return mockDataStore.getMockUser();
  }),
});

// ============ COMBINED MOCK ROUTER ============

export const mockRouter = router({
  dashboard: dashboardRouter,
  contacts: contactsMockRouter,
  leads: leadsMockRouter,
  employees: employeesMockRouter,
  inventory: inventoryMockRouter,
  orders: ordersMockRouter,
  chat: chatMockRouter,
  mockAuth: mockAuthRouter,
});
