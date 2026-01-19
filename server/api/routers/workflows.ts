import { z } from "zod";
import { router, protectedProcedure } from "../../_core/trpc";
import { getDb } from "../../db";
import { workflows, workflowLogs, leads, templates } from "../../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { getEmailService } from "../../email-service";
import { getSMSService } from "../../sms-service";
import { notifyOwner } from "../../_core/notification";

// Workflow action types
const actionSchema = z.object({
  type: z.enum(["send_email", "send_sms", "create_notification", "update_lead", "call_webhook"] as const),
  config: z.record(z.string(), z.any()), // Action-specific configuration
});

// Workflow condition schema
const conditionSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"] as const),
  value: z.unknown(),
});

export const workflowsRouter = router({
  // List all workflows for the user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, ctx.user.id))
      .orderBy(desc(workflows.createdAt));
  }),

  // Get a single workflow by ID
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const workflow = await db
        .select()
        .from(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.userId, ctx.user.id)))
        .limit(1);
      
      return workflow[0] || null;
    }),

  // Create a new workflow
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        trigger: z.enum([
          "lead_captured",
          "appointment_scheduled",
          "order_placed",
          "payment_received",
          "email_opened",
          "campaign_sent",
        ]),
        actions: z.array(actionSchema),
        conditions: z.array(conditionSchema).optional(),
        enabled: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [workflow] = await db.insert(workflows).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        trigger: input.trigger,
        actions: input.actions as any,
        conditions: input.conditions as any || null,
        enabled: input.enabled,
      });

      return { id: workflow.insertId };
    }),

  // Update an existing workflow
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        trigger: z.enum([
          "lead_captured",
          "appointment_scheduled",
          "order_placed",
          "payment_received",
          "email_opened",
          "campaign_sent",
        ]).optional(),
        actions: z.array(actionSchema).optional(),
        conditions: z.array(conditionSchema).optional(),
        enabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(workflows)
        .set(updates as any)
        .where(and(eq(workflows.id, id), eq(workflows.userId, ctx.user.id)));

      return { success: true };
    }),

  // Delete a workflow
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .delete(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.userId, ctx.user.id)));

      return { success: true };
    }),

  // Toggle workflow enabled status
  toggle: protectedProcedure
    .input(z.object({ id: z.number(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(workflows)
        .set({ enabled: input.enabled })
        .where(and(eq(workflows.id, input.id), eq(workflows.userId, ctx.user.id)));

      return { success: true };
    }),

  // Get workflow execution logs
  getLogs: protectedProcedure
    .input(z.object({ workflowId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(workflowLogs)
        .where(and(eq(workflowLogs.workflowId, input.workflowId), eq(workflowLogs.userId, ctx.user.id)))
        .orderBy(desc(workflowLogs.createdAt))
        .limit(100);
    }),

  // Get all execution logs for user
  getAllLogs: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(workflowLogs)
      .where(eq(workflowLogs.userId, ctx.user.id))
      .orderBy(desc(workflowLogs.createdAt))
      .limit(100);
  }),

  // Execute a workflow manually (for testing)
  execute: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        triggerData: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const workflow = await db
        .select()
        .from(workflows)
        .where(and(eq(workflows.id, input.workflowId), eq(workflows.userId, ctx.user.id)))
        .limit(1);

      if (!workflow[0]) {
        throw new Error("Workflow not found");
      }

      if (!workflow[0].enabled) {
        throw new Error("Workflow is disabled");
      }

      return await executeWorkflow(workflow[0], input.triggerData, ctx.user.id);
    }),

  // Get workflow templates
  getTemplates: protectedProcedure.query(async () => {
    return WORKFLOW_TEMPLATES;
  }),
});

// Workflow execution engine
export async function executeWorkflow(
  workflow: any,
  triggerData: Record<string, any>,
  userId: number
): Promise<any> {
  const startTime = Date.now();
  const results: any[] = [];
  let status: "success" | "failed" | "partial" = "success";
  let errorMessage: string | undefined;

  try {
    // Check conditions if any
    if (workflow.conditions && Array.isArray(workflow.conditions)) {
      const conditionsMet = evaluateConditions(workflow.conditions as any[], triggerData);
      if (!conditionsMet) {
        return {
          success: false,
          message: "Workflow conditions not met",
        };
      }
    }

    // Execute each action
    const actions = workflow.actions as any[];
    for (const action of actions) {
      try {
        const result = await executeAction(action, triggerData, userId);
        results.push({ action: action.type, success: true, result });
      } catch (error: any) {
        results.push({ action: action.type, success: false, error: error.message });
        status = "partial";
      }
    }

    // If all actions failed, mark as failed
    if (results.every((r) => !r.success)) {
      status = "failed";
      errorMessage = "All actions failed";
    }

    // Log execution
    const dbLog = await getDb();
    if (!dbLog) throw new Error("Database not available");
    await dbLog.insert(workflowLogs).values({
      workflowId: workflow.id,
      userId,
      status,
      triggerData: triggerData as any,
      executionResults: results as any,
      errorMessage,
      executionTime: Date.now() - startTime,
    });

    // Update workflow execution count and last executed time
    const dbUpdate = await getDb();
    if (dbUpdate) {
      await dbUpdate
        .update(workflows)
        .set({
          executionCount: workflow.executionCount + 1,
          lastExecutedAt: new Date(),
        })
        .where(eq(workflows.id, workflow.id));
    }

    return {
      success: status !== "failed",
      status,
      results,
      executionTime: Date.now() - startTime,
    };
  } catch (error: any) {
    // Log failed execution
    const dbLog = await getDb();
    if (!dbLog) throw error;
    await dbLog.insert(workflowLogs).values({
      workflowId: workflow.id,
      userId,
      status: "failed",
      triggerData: triggerData as any,
      executionResults: results as any,
      errorMessage: error.message,
      executionTime: Date.now() - startTime,
    });

    throw error;
  }
}

// Evaluate workflow conditions
function evaluateConditions(conditions: any[], data: Record<string, any>): boolean {
  return conditions.every((condition) => {
    const fieldValue = data[condition.field];
    const targetValue = condition.value;

    switch (condition.operator) {
      case "equals":
        return fieldValue === targetValue;
      case "not_equals":
        return fieldValue !== targetValue;
      case "contains":
        return String(fieldValue).includes(String(targetValue));
      case "greater_than":
        return Number(fieldValue) > Number(targetValue);
      case "less_than":
        return Number(fieldValue) < Number(targetValue);
      default:
        return false;
    }
  });
}

// Execute a single action
async function executeAction(
  action: any,
  triggerData: Record<string, any>,
  userId: number
): Promise<any> {
  switch (action.type) {
    case "send_email": {
      const { templateId, to, subject, variables } = action.config;
      
      // Get template if specified
      let emailContent = action.config.content || "";
      let emailSubject = subject || "Notification";
      
      if (templateId) {
        const dbTemplate = await getDb();
        if (!dbTemplate) throw new Error("Database not available");
        const template = await dbTemplate
          .select()
          .from(templates)
          .where(and(eq(templates.id, templateId), eq(templates.userId, userId)))
          .limit(1);
        
        if (template[0]) {
          emailContent = template[0].content;
          emailSubject = template[0].subject || emailSubject;
        }
      }

      // Replace variables in content
      const mergedVariables = { ...triggerData, ...variables };
      const processedContent = replaceVariables(emailContent, mergedVariables);
      const processedSubject = replaceVariables(emailSubject, mergedVariables);

      const toEmail = to || triggerData.email || triggerData.customerEmail;
      if (!toEmail) {
        throw new Error("No recipient email specified");
      }

      const emailService = getEmailService();
      return await emailService.sendEmail({
        to: toEmail,
        subject: processedSubject,
        html: processedContent,
      });
    }

    case "send_sms": {
      const { templateId, to, variables } = action.config;
      
      let smsContent = action.config.content || "";
      
      if (templateId) {
        const dbTemplate = await getDb();
        if (!dbTemplate) throw new Error("Database not available");
        const template = await dbTemplate
          .select()
          .from(templates)
          .where(and(eq(templates.id, templateId), eq(templates.userId, userId)))
          .limit(1);
        
        if (template[0]) {
          smsContent = template[0].content;
        }
      }

      const mergedVariables = { ...triggerData, ...variables };
      const processedContent = replaceVariables(smsContent, mergedVariables);

      const toPhone = to || triggerData.phone;
      if (!toPhone) {
        throw new Error("No recipient phone specified");
      }

      const smsService = getSMSService();
      return await smsService.sendSMS({
        to: toPhone,
        message: processedContent,
      });
    }

    case "create_notification": {
      const { title, message } = action.config;
      const processedTitle = replaceVariables(title, triggerData);
      const processedMessage = replaceVariables(message, triggerData);

      return await notifyOwner({
        title: processedTitle,
        content: processedMessage,
      });
    }

    case "update_lead": {
      const { leadId, updates } = action.config;
      const id = leadId || triggerData.leadId || triggerData.id;
      
      if (!id) {
        throw new Error("No lead ID specified");
      }

      const dbLead = await getDb();
      if (!dbLead) throw new Error("Database not available");
      await dbLead
        .update(leads)
        .set(updates)
        .where(and(eq(leads.id, id), eq(leads.userId, userId)));

      return { updated: true, leadId: id };
    }

    case "call_webhook": {
      const { url, method = "POST", headers = {}, body } = action.config;
      
      const processedBody = body ? JSON.parse(replaceVariables(JSON.stringify(body), triggerData)) : triggerData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(processedBody),
      });

      return {
        status: response.status,
        ok: response.ok,
        data: await response.json().catch(() => null),
      };
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Replace variables in text with actual values
function replaceVariables(text: string, variables: Record<string, any>): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, String(value));
  }
  return result;
}

// Pre-built workflow templates
const WORKFLOW_TEMPLATES = [
  {
    id: "welcome_email",
    name: "Welcome New Lead",
    description: "Send a welcome email when a new lead is captured",
    trigger: "lead_captured",
    actions: [
      {
        type: "send_email",
        config: {
          subject: "Welcome to {{companyName}}!",
          content: "Hi {{name}},\n\nThank you for your interest! We're excited to help you achieve your goals.\n\nBest regards,\nThe Team",
        },
      },
      {
        type: "create_notification",
        config: {
          title: "New Lead Captured",
          message: "{{name}} ({{email}}) just signed up!",
        },
      },
    ],
  },
  {
    id: "appointment_reminder",
    name: "Appointment Reminder",
    description: "Send reminder 24 hours before appointment",
    trigger: "appointment_scheduled",
    actions: [
      {
        type: "send_email",
        config: {
          subject: "Appointment Reminder - {{title}}",
          content: "Hi {{attendeeName}},\n\nThis is a reminder about your appointment:\n\n{{title}}\n{{startTime}}\n\nLooking forward to meeting you!\n\nBest regards",
        },
      },
      {
        type: "send_sms",
        config: {
          content: "Reminder: Your appointment '{{title}}' is tomorrow. See you then!",
        },
      },
    ],
  },
  {
    id: "order_confirmation",
    name: "Order Confirmation",
    description: "Send confirmation email when order is placed",
    trigger: "order_placed",
    actions: [
      {
        type: "send_email",
        config: {
          subject: "Order Confirmation - {{productName}}",
          content: "Hi {{customerName}},\n\nThank you for your order!\n\nProduct: {{productName}}\nAmount: ${{amount}}\n\nYour order is being processed.\n\nBest regards",
        },
      },
    ],
  },
  {
    id: "lead_nurture",
    name: "Lead Nurture Sequence",
    description: "Multi-step email sequence for new leads",
    trigger: "lead_captured",
    actions: [
      {
        type: "send_email",
        config: {
          subject: "Day 1: Welcome to {{companyName}}",
          content: "Welcome email content...",
        },
      },
      {
        type: "update_lead",
        config: {
          updates: { status: "contacted" },
        },
      },
    ],
  },
  {
    id: "payment_webhook",
    name: "Payment Webhook Notification",
    description: "Call external webhook when payment is received",
    trigger: "payment_received",
    actions: [
      {
        type: "call_webhook",
        config: {
          url: "https://your-app.com/webhooks/payment",
          method: "POST",
          body: {
            orderId: "{{orderId}}",
            amount: "{{amount}}",
            customerEmail: "{{customerEmail}}",
          },
        },
      },
    ],
  },
];
