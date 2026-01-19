import { z } from "zod";
import { protectedProcedure, router } from "../../_core/trpc";
import { getDb } from "../../db";
import { contacts, contactActivities, contactTags, contactLists, contactListMembers } from "../../../drizzle/schema";
import { eq, and, like, or, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { mockContacts, getMockStats } from "../../mockDataHelper";

export const crmRouter = router({
  // List contacts with filters
  listContacts: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        search: z.string().optional(),
        status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
        tags: z.array(z.string()).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let query = db
        .select()
        .from(contacts)
        .where(eq(contacts.workspaceId, input.workspaceId))
        .orderBy(desc(contacts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Apply filters
      const conditions = [eq(contacts.workspaceId, input.workspaceId)];

      if (input.search) {
        conditions.push(
          or(
            like(contacts.firstName, `%${input.search}%`),
            like(contacts.lastName, `%${input.search}%`),
            like(contacts.email, `%${input.search}%`),
            like(contacts.company, `%${input.search}%`)
          ) as any
        );
      }

      if (input.status) {
        conditions.push(eq(contacts.status, input.status));
      }

      const result = await db
        .select()
        .from(contacts)
        .where(and(...conditions))
        .orderBy(desc(contacts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  // Get single contact with activity timeline
  getContact: protectedProcedure
    .input(z.object({ id: z.number(), workspaceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [contact] = await db
        .select()
        .from(contacts)
        .where(and(eq(contacts.id, input.id), eq(contacts.workspaceId, input.workspaceId)));

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Contact not found" });
      }

      // Get activity timeline
      const activities = await db
        .select()
        .from(contactActivities)
        .where(eq(contactActivities.contactId, input.id))
        .orderBy(desc(contactActivities.createdAt))
        .limit(50);

      return { ...contact, activities };
    }),

  // Create contact
  createContact: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        source: z.string().optional(),
        status: z.enum(["lead", "prospect", "customer", "inactive"]).default("lead"),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check for duplicates
      if (input.email) {
        const [existing] = await db
          .select()
          .from(contacts)
          .where(and(eq(contacts.workspaceId, input.workspaceId), eq(contacts.email, input.email)));

        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Contact with this email already exists" });
        }
      }

      const [contact] = await db.insert(contacts).values({
        ...input,
        createdBy: ctx.user.id,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      });

      // Log activity
      await db.insert(contactActivities).values({
        contactId: contact.insertId,
        workspaceId: input.workspaceId,
        type: "note",
        title: "Contact created",
        description: `Contact added to CRM`,
        createdBy: ctx.user.id,
      });

      return { id: contact.insertId };
    }),

  // Update contact
  updateContact: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        workspaceId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        leadScore: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updateData: any = { ...input };
      delete updateData.id;
      delete updateData.workspaceId;

      if (input.tags) {
        updateData.tags = JSON.stringify(input.tags);
      }

      await db
        .update(contacts)
        .set(updateData)
        .where(and(eq(contacts.id, input.id), eq(contacts.workspaceId, input.workspaceId)));

      // Log activity
      await db.insert(contactActivities).values({
        contactId: input.id,
        workspaceId: input.workspaceId,
        type: "note",
        title: "Contact updated",
        description: `Contact information updated`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  // Delete contact
  deleteContact: protectedProcedure
    .input(z.object({ id: z.number(), workspaceId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Delete activities first
      await db.delete(contactActivities).where(eq(contactActivities.contactId, input.id));

      // Delete contact
      await db
        .delete(contacts)
        .where(and(eq(contacts.id, input.id), eq(contacts.workspaceId, input.workspaceId)));

      return { success: true };
    }),

  // Add activity to contact
  addActivity: protectedProcedure
    .input(
      z.object({
        contactId: z.number(),
        workspaceId: z.number(),
        type: z.enum(["note", "email", "call", "meeting", "task", "form_submission", "purchase", "campaign"]),
        title: z.string(),
        description: z.string().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db.insert(contactActivities).values({
        ...input,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        createdBy: ctx.user.id,
      });

      // Update lastContactedAt
      await db
        .update(contacts)
        .set({ lastContactedAt: new Date() })
        .where(eq(contacts.id, input.contactId));

      return { id: activity.insertId };
    }),

  // Import contacts from CSV
  importContacts: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        contacts: z.array(
          z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
            company: z.string().optional(),
            jobTitle: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let imported = 0;
      let skipped = 0;

      for (const contactData of input.contacts) {
        // Skip if no email
        if (!contactData.email) {
          skipped++;
          continue;
        }

        // Check for duplicates
        const [existing] = await db
          .select()
          .from(contacts)
          .where(and(eq(contacts.workspaceId, input.workspaceId), eq(contacts.email, contactData.email)));

        if (existing) {
          skipped++;
          continue;
        }

        // Insert contact
        await db.insert(contacts).values({
          ...contactData,
          workspaceId: input.workspaceId,
          createdBy: ctx.user.id,
          status: "lead",
          source: "csv_import",
        });

        imported++;
      }

      return { imported, skipped, total: input.contacts.length };
    }),

  // Export contacts to CSV
  exportContacts: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(contacts)
        .where(eq(contacts.workspaceId, input.workspaceId))
        .orderBy(desc(contacts.createdAt));

      return result;
    }),

  // Get contact statistics
  getStats: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [stats] = await db
        .select({
          total: sql<number>`count(*)`,
          leads: sql<number>`sum(case when status = 'lead' then 1 else 0 end)`,
          prospects: sql<number>`sum(case when status = 'prospect' then 1 else 0 end)`,
          customers: sql<number>`sum(case when status = 'customer' then 1 else 0 end)`,
        })
        .from(contacts)
        .where(eq(contacts.workspaceId, input.workspaceId));

      return stats;
    }),

  // Manage tags
  listTags: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      return await db.select().from(contactTags).where(eq(contactTags.workspaceId, input.workspaceId));
    }),

  createTag: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        name: z.string(),
        color: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [tag] = await db.insert(contactTags).values(input);
      return { id: tag.insertId };
    }),

  // Manage lists
  listLists: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      return await db.select().from(contactLists).where(eq(contactLists.workspaceId, input.workspaceId));
    }),

  createList: protectedProcedure
    .input(
      z.object({
        workspaceId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(["static", "dynamic"]).default("static"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [list] = await db.insert(contactLists).values({
        ...input,
        createdBy: ctx.user.id,
      });

      return { id: list.insertId };
    }),

  addToList: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        contactId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if already in list
      const [existing] = await db
        .select()
        .from(contactListMembers)
        .where(and(eq(contactListMembers.listId, input.listId), eq(contactListMembers.contactId, input.contactId)));

      if (existing) {
        return { success: true, alreadyInList: true };
      }

      await db.insert(contactListMembers).values(input);

      // Update contact count
      const [count] = await db
        .select({ count: sql<number>`count(*)` })
        .from(contactListMembers)
        .where(eq(contactListMembers.listId, input.listId));

      await db
        .update(contactLists)
        .set({ contactCount: count.count })
        .where(eq(contactLists.id, input.listId));

      return { success: true };
    }),
});
