import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { contractGenTemplates, contractGenContracts, type InsertContractGenTemplate, type InsertContractGenContract } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

export const contractGeneratorRouter = router({
  // ============= TEMPLATES =============
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db.select().from(contractGenTemplates).where(eq(contractGenTemplates.userId, ctx.user.id)).orderBy(desc(contractGenTemplates.createdAt));
  }),

  createTemplate: protectedProcedure.input(z.object({ name: z.string().min(1).max(255), category: z.string().max(100).optional(), content: z.string().min(1), variables: z.array(z.object({ name: z.string(), type: z.string(), description: z.string() })).optional(), isPublic: z.boolean().default(false) })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const [template] = await db.insert(contractGenTemplates).values({ userId: ctx.user.id, ...input, variables: input.variables ? JSON.stringify(input.variables) : null } as InsertContractGenTemplate).$returningId();
    return template;
  }),

  updateTemplate: protectedProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(1).max(255).optional(), category: z.string().max(100).optional(), content: z.string().min(1).optional(), variables: z.array(z.object({ name: z.string(), type: z.string(), description: z.string() })).optional(), isPublic: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const { id, ...updates } = input;
    const updateData: any = { ...updates };
    if (updates.variables) updateData.variables = JSON.stringify(updates.variables);
    await db.update(contractGenTemplates).set(updateData).where(and(eq(contractGenTemplates.id, id), eq(contractGenTemplates.userId, ctx.user.id)));
    return { success: true };
  }),

  deleteTemplate: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(contractGenTemplates).where(and(eq(contractGenTemplates.id, input.id), eq(contractGenTemplates.userId, ctx.user.id)));
    return { success: true };
  }),

  // ============= CONTRACTS =============
  getContracts: protectedProcedure.input(z.object({ status: z.enum(["draft", "pending_signature", "signed", "expired", "cancelled"]).optional() })).query(async ({ ctx, input }) => {
    const db = getDb();
    let query = db.select().from(contractGenContracts).where(eq(contractGenContracts.userId, ctx.user.id));
    if (input.status) query = query.where(eq(contractGenContracts.status, input.status));
    return await query.orderBy(desc(contractGenContracts.createdAt));
  }),

  createContract: protectedProcedure.input(z.object({ templateId: z.number().int().positive().optional(), title: z.string().min(1).max(255), content: z.string().min(1), parties: z.array(z.object({ name: z.string(), email: z.string().email(), role: z.string() })), expiresAt: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const [contract] = await db.insert(contractGenContracts).values({ userId: ctx.user.id, ...input, parties: JSON.stringify(input.parties), expiresAt: input.expiresAt ? new Date(input.expiresAt) : null } as InsertContractGenContract).$returningId();
    return contract;
  }),

  updateContract: protectedProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().min(1).max(255).optional(), content: z.string().min(1).optional(), status: z.enum(["draft", "pending_signature", "signed", "expired", "cancelled"]).optional(), expiresAt: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const { id, ...updates } = input;
    const updateData: any = { ...updates };
    if (updates.expiresAt) updateData.expiresAt = new Date(updates.expiresAt);
    await db.update(contractGenContracts).set(updateData).where(and(eq(contractGenContracts.id, id), eq(contractGenContracts.userId, ctx.user.id)));
    return { success: true };
  }),

  deleteContract: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(contractGenContracts).where(and(eq(contractGenContracts.id, input.id), eq(contractGenContracts.userId, ctx.user.id)));
    return { success: true };
  }),

  // ============= AI DRAFTING =============
  generateContract: protectedProcedure.input(z.object({ contractType: z.string(), parties: z.array(z.object({ name: z.string(), role: z.string() })), terms: z.string(), jurisdiction: z.string().optional() })).mutation(async ({ input }) => {
    const response = await invokeLLM({ messages: [{ role: "system", content: "You are a legal contract drafting assistant. Generate professional contract language based on the provided details. Include standard clauses for the contract type." }, { role: "user", content: `Contract Type: ${input.contractType}\nParties: ${input.parties.map(p => `${p.name} (${p.role})`).join(", ")}\nTerms: ${input.terms}\nJurisdiction: ${input.jurisdiction || "Not specified"}\n\nGenerate a complete contract:` }] });
    return { contractContent: response.choices[0].message.content.trim() };
  }),
});
