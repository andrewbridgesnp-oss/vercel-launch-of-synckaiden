import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import { getDb } from "../../db";
import { forms, formSubmissions, contacts } from "../../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const formsRouter = router({
  // Create new form
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        fields: z.array(z.record(z.string(), z.any())),
        settings: z.record(z.string(), z.any()).optional(),
        submitButtonText: z.string().optional(),
        successMessage: z.string().optional(),
        redirectUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .insert(forms)
        .values({
          workspaceId: input.workspaceId,
          name: input.name,
          description: input.description,
          fields: JSON.stringify(input.fields),
          settings: JSON.stringify({
            ...input.settings,
            submitButtonText: input.submitButtonText || "Submit",
            successMessage: input.successMessage || "Thank you for your submission!",
            redirectUrl: input.redirectUrl,
          }),
          createdBy: ctx.user.id,
        });

      // Get the created form
      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.workspaceId, input.workspaceId), eq(forms.name, input.name)))
        .orderBy(desc(forms.createdAt))
        .limit(1);
      
      return form;
    }),

  // List forms
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const formsList = await db
        .select()
        .from(forms)
        .where(eq(forms.workspaceId, input.workspaceId))
        .orderBy(desc(forms.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return formsList.map((form) => ({
        ...form,
        fields: form.fields ? JSON.parse(form.fields as string) : [],
        settings: form.settings ? JSON.parse(form.settings as string) : {},
      }));
    }),

  // Get single form
  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        workspaceId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.id), eq(forms.workspaceId, input.workspaceId)));

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return {
        ...form,
        fields: form.fields ? JSON.parse(form.fields as string) : [],
        settings: form.settings ? JSON.parse(form.settings as string) : {},
      };
    }),

  // Get public form (no auth required)
  getPublic: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [form] = await db.select().from(forms).where(eq(forms.id, input.id));

      if (!form || !form.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return {
        ...form,
        fields: form.fields ? JSON.parse(form.fields as string) : [],
        settings: form.settings ? JSON.parse(form.settings as string) : {},
      };
    }),

  // Update form
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        workspaceId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        fields: z.array(z.record(z.string(), z.any())).optional(),
        settings: z.record(z.string(), z.any()).optional(),
        submitButtonText: z.string().optional(),
        successMessage: z.string().optional(),
        redirectUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.fields) updateData.fields = JSON.stringify(input.fields);
      
      // Merge settings
      if (input.settings || input.submitButtonText || input.successMessage || input.redirectUrl !== undefined) {
        const currentSettings = input.settings || {};
        updateData.settings = JSON.stringify({
          ...currentSettings,
          ...(input.submitButtonText && { submitButtonText: input.submitButtonText }),
          ...(input.successMessage && { successMessage: input.successMessage }),
          ...(input.redirectUrl !== undefined && { redirectUrl: input.redirectUrl }),
        });
      }
      
      if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;

      await db
        .update(forms)
        .set(updateData)
        .where(and(eq(forms.id, input.id), eq(forms.workspaceId, input.workspaceId)));

      return { success: true };
    }),

  // Delete form
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        workspaceId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Delete submissions first
      await db.delete(formSubmissions).where(eq(formSubmissions.formId, input.id));

      // Delete form
      await db
        .delete(forms)
        .where(and(eq(forms.id, input.id), eq(forms.workspaceId, input.workspaceId)));

      return { success: true };
    }),

  // Submit form (public endpoint)
  submit: publicProcedure
    .input(
      z.object({
        formId: z.number(),
        data: z.record(z.string(), z.any()),
        honeypot: z.string().optional(), // Spam protection
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Honeypot spam check
      if (input.honeypot) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Spam detected" });
      }

      // Get form
      const [form] = await db.select().from(forms).where(eq(forms.id, input.formId));

      if (!form || !form.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      // Create submission
      await db
        .insert(formSubmissions)
        .values({
          formId: input.formId,
          workspaceId: form.workspaceId,
          data: JSON.stringify(input.data),
        });
      
      // Get the created submission
      const [submission] = await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, input.formId))
        .orderBy(desc(formSubmissions.submittedAt))
        .limit(1);

      // Auto-add to CRM if email provided
      if (input.data.email) {
        try {
          // Check if contact exists
          const existingContact = await db
            .select()
            .from(contacts)
            .where(
              and(
                eq(contacts.workspaceId, form.workspaceId),
                eq(contacts.email, input.data.email as string)
              )
            );

          if (existingContact.length === 0) {
            // Create new contact
            await db.insert(contacts).values({
              workspaceId: form.workspaceId,
              firstName: input.data.firstName as string || input.data.name as string || "",
              lastName: input.data.lastName as string || "",
              email: input.data.email as string,
              phone: input.data.phone as string || null,
              company: input.data.company as string || null,
              status: "lead",
              source: `Form: ${form.name}`,
              createdBy: 1, // System user for form submissions
            });
          }
        } catch (error) {
          // Don't fail submission if CRM integration fails
          console.error("Failed to add contact to CRM:", error);
        }
      }

      const settings = form.settings ? JSON.parse(form.settings as string) : {};
      
      return {
        success: true,
        submissionId: submission?.id || 0,
        message: settings.successMessage || "Thank you for your submission!",
        redirectUrl: settings.redirectUrl,
      };
    }),

  // List submissions
  listSubmissions: protectedProcedure
    .input(
      z.object({
        formId: z.number(),
        workspaceId: z.number(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Verify form belongs to workspace
      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.workspaceId, input.workspaceId)));

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      const submissions = await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, input.formId))
        .orderBy(desc(formSubmissions.submittedAt))
        .limit(input.limit)
        .offset(input.offset);

      return submissions.map((sub) => ({
        ...sub,
        data: sub.data ? JSON.parse(sub.data as string) : {},
      }));
    }),

  // Get form statistics
  getStats: protectedProcedure
    .input(
      z.object({
        formId: z.number(),
        workspaceId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify form belongs to workspace
      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.workspaceId, input.workspaceId)));

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      const submissions = await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, input.formId));

      return {
        totalSubmissions: submissions.length,
        views: form.viewCount || 0,
        conversionRate:
          form.viewCount && form.viewCount > 0 ? ((submissions.length / form.viewCount) * 100).toFixed(2) : "0",
      };
    }),

  // Increment form views
  incrementViews: publicProcedure
    .input(z.object({ formId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const [currentForm] = await db.select().from(forms).where(eq(forms.id, input.formId));
      if (currentForm) {
        await db
          .update(forms)
          .set({ viewCount: (currentForm.viewCount || 0) + 1 })
          .where(eq(forms.id, input.formId));
      }

      return { success: true };
    }),
});
