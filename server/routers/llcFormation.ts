import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as llcService from "../services/llcFormation";
import { invokeLLM } from "../_core/llm";

/**
 * LLC Formation Wizard Router
 * 
 * Premium $24.99/month service for forming LLCs with state-specific guidance,
 * AI-powered document generation, and filing assistance.
 */

export const llcFormationRouter = router({
  // ============= LLC FORMATIONS =============

  // List all LLC formations for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await llcService.getUserLlcFormations(ctx.user.id);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch LLC formations",
      });
    }
  }),

  // Get single LLC formation by ID with documents
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    try {
      const formation = await llcService.getLlcFormationById(input.id, ctx.user.id);

      if (!formation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "LLC formation not found" });
      }

      return formation;
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch LLC formation",
      });
    }
  }),

  // Create new LLC formation
  create: protectedProcedure
    .input(
      z.object({
        companyName: z.string().min(1, "Company name is required"),
        state: z.string().length(2, "State must be 2-letter code"),
        businessType: z.string().optional(),
        businessPurpose: z.string().optional(),
        managementStructure: z.enum(["member_managed", "manager_managed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get state requirements to set filing fee
        const stateReq = await llcService.getStateRequirements(input.state);

        const formation = await llcService.createLlcFormation({
          userId: ctx.user.id,
          companyName: input.companyName,
          state: input.state,
          businessType: input.businessType,
          businessPurpose: input.businessPurpose,
          managementStructure: input.managementStructure,
          filingFee: stateReq?.filingFee || 0,
          status: "draft",
        });

        return formation;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create LLC formation",
        });
      }
    }),

  // Update LLC formation
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        companyName: z.string().optional(),
        businessType: z.string().optional(),
        businessPurpose: z.string().optional(),
        registeredAgent: z.any().optional(),
        members: z.any().optional(),
        managementStructure: z.enum(["member_managed", "manager_managed"]).optional(),
        status: z.enum(["draft", "in_progress", "filed", "approved", "rejected"]).optional(),
        ein: z.string().optional(),
        filedDate: z.string().optional(),
        approvedDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, filedDate, approvedDate, ...updates } = input;

        await llcService.updateLlcFormation(id, ctx.user.id, {
          ...updates,
          filedDate: filedDate ? new Date(filedDate) : undefined,
          approvedDate: approvedDate ? new Date(approvedDate) : undefined,
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update LLC formation",
        });
      }
    }),

  // Delete LLC formation
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await llcService.deleteLlcFormation(input.id, ctx.user.id);
      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete LLC formation",
      });
    }
  }),

  // ============= STATE REQUIREMENTS =============

  // Get state requirements by state code
  getStateRequirements: protectedProcedure
    .input(z.object({ state: z.string().length(2) }))
    .query(async ({ input }) => {
      try {
        const requirements = await llcService.getStateRequirements(input.state);

        if (!requirements) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "State requirements not found. Please contact support.",
          });
        }

        return requirements;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch state requirements",
        });
      }
    }),

  // List all state requirements
  listStates: protectedProcedure.query(async () => {
    try {
      return await llcService.getAllStateRequirements();
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch state requirements",
      });
    }
  }),

  // ============= DOCUMENT GENERATION =============

  // Generate Articles of Organization using AI
  generateArticles: protectedProcedure
    .input(z.object({ llcFormationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const formation = await llcService.getLlcFormationById(input.llcFormationId, ctx.user.id);

        if (!formation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "LLC formation not found" });
        }

        const stateReq = await llcService.getStateRequirements(formation.state);

        // Generate document using LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a legal document expert specializing in LLC formation. Generate professional Articles of Organization documents that comply with state requirements.`,
            },
            {
              role: "user",
              content: `Generate Articles of Organization for:
Company Name: ${formation.companyName}
State: ${formation.state} (${stateReq?.stateName || formation.state})
Business Purpose: ${formation.businessPurpose || "General business purposes"}
Management Structure: ${formation.managementStructure || "member_managed"}
Members: ${JSON.stringify(formation.members || [])}
Registered Agent: ${JSON.stringify(formation.registeredAgent || {})}

Include all required sections per ${stateReq?.stateName || formation.state} law. Format as a professional legal document.`,
            },
          ],
        });

        const generatedContent = response.choices[0].message.content;

        // Save document
        const document = await llcService.createLlcDocument({
          llcFormationId: input.llcFormationId,
          documentType: "articles_of_organization",
          documentName: `Articles of Organization - ${formation.companyName}`,
          generatedContent,
          status: "generated",
        });

        return { document, content: generatedContent };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to generate articles",
        });
      }
    }),

  // Generate Operating Agreement using AI
  generateOperatingAgreement: protectedProcedure
    .input(z.object({ llcFormationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const formation = await llcService.getLlcFormationById(input.llcFormationId, ctx.user.id);

        if (!formation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "LLC formation not found" });
        }

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a legal document expert. Generate comprehensive Operating Agreements for LLCs that cover management, capital contributions, distributions, and dissolution.`,
            },
            {
              role: "user",
              content: `Generate an Operating Agreement for:
Company Name: ${formation.companyName}
State: ${formation.state}
Management Structure: ${formation.managementStructure || "member_managed"}
Members: ${JSON.stringify(formation.members || [])}

Include sections on: Formation, Management, Capital Contributions, Distributions, Meetings, Transfer of Interests, Dissolution, and Miscellaneous Provisions.`,
            },
          ],
        });

        const generatedContent = response.choices[0].message.content;

        const document = await llcService.createLlcDocument({
          llcFormationId: input.llcFormationId,
          documentType: "operating_agreement",
          documentName: `Operating Agreement - ${formation.companyName}`,
          generatedContent,
          status: "generated",
        });

        return { document, content: generatedContent };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to generate operating agreement",
        });
      }
    }),

  // ============= DOCUMENTS =============

  // Get documents for LLC formation
  getDocuments: protectedProcedure
    .input(z.object({ llcFormationId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        return await llcService.getLlcDocuments(input.llcFormationId, ctx.user.id);
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch documents",
        });
      }
    }),
});
