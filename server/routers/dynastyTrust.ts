import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as dynastyService from "../services/dynastyTrust";
import { invokeLLM } from "../_core/llm";

/**
 * Dynasty Trust Workbook Router
 * 
 * Premium $24.99/month wealth planning tool for creating dynasty trusts,
 * managing beneficiaries, and planning multi-generational asset protection.
 */

export const dynastyTrustRouter = router({
  // ============= TRUST WORKBOOKS =============

  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await dynastyService.getUserTrustWorkbooks(ctx.user.id);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch trust workbooks",
      });
    }
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    try {
      const workbook = await dynastyService.getTrustWorkbookById(input.id, ctx.user.id);

      if (!workbook) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trust workbook not found" });
      }

      return workbook;
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch trust workbook",
      });
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        trustName: z.string().min(1),
        trustType: z.enum(["dynasty", "irrevocable", "revocable", "ilit"]),
        jurisdiction: z.enum(["south_dakota", "nevada", "delaware", "other"]).optional(),
        grantorInfo: z.any().optional(),
        assetProtectionGoals: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await dynastyService.createTrustWorkbook({
          userId: ctx.user.id,
          ...input,
          status: "draft",
        });
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create trust workbook",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        trustName: z.string().optional(),
        trustType: z.enum(["dynasty", "irrevocable", "revocable", "ilit"]).optional(),
        jurisdiction: z.enum(["south_dakota", "nevada", "delaware", "other"]).optional(),
        grantorInfo: z.any().optional(),
        trusteeInfo: z.any().optional(),
        trustProtector: z.any().optional(),
        beneficiaries: z.any().optional(),
        assetProtectionGoals: z.string().optional(),
        taxConsiderations: z.any().optional(),
        distributionRules: z.any().optional(),
        estimatedAssetValue: z.number().optional(),
        status: z.enum(["draft", "in_review", "attorney_review", "completed"]).optional(),
        attorneyNotes: z.string().optional(),
        completedAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, completedAt, ...updates } = input;

        await dynastyService.updateTrustWorkbook(id, ctx.user.id, {
          ...updates,
          completedAt: completedAt ? new Date(completedAt) : undefined,
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update trust workbook",
        });
      }
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await dynastyService.deleteTrustWorkbook(input.id, ctx.user.id);
      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete trust workbook",
      });
    }
  }),

  // ============= BENEFICIARIES =============

  addBeneficiary: protectedProcedure
    .input(
      z.object({
        trustWorkbookId: z.number(),
        fullName: z.string().min(1),
        relationship: z.string().optional(),
        dateOfBirth: z.string().optional(),
        beneficiaryType: z.enum(["primary", "contingent", "remainder"]),
        distributionPercentage: z.number().min(0).max(100).optional(),
        distributionConditions: z.string().optional(),
        specialNeeds: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { dateOfBirth, ...rest } = input;

        return await dynastyService.createBeneficiary(
          {
            ...rest,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          },
          ctx.user.id
        );
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to add beneficiary",
        });
      }
    }),

  updateBeneficiary: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().optional(),
        relationship: z.string().optional(),
        dateOfBirth: z.string().optional(),
        beneficiaryType: z.enum(["primary", "contingent", "remainder"]).optional(),
        distributionPercentage: z.number().min(0).max(100).optional(),
        distributionConditions: z.string().optional(),
        specialNeeds: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, dateOfBirth, ...updates } = input;

        await dynastyService.updateBeneficiary(id, ctx.user.id, {
          ...updates,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update beneficiary",
        });
      }
    }),

  deleteBeneficiary: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await dynastyService.deleteBeneficiary(input.id, ctx.user.id);
      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete beneficiary",
      });
    }
  }),

  // ============= AI ANALYSIS =============

  generateAnalysis: protectedProcedure
    .input(z.object({ trustWorkbookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const workbook = await dynastyService.getTrustWorkbookById(input.trustWorkbookId, ctx.user.id);

        if (!workbook) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Trust workbook not found" });
        }

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a wealth planning expert specializing in dynasty trusts and multi-generational asset protection. Provide comprehensive analysis and recommendations.`,
            },
            {
              role: "user",
              content: `Analyze this dynasty trust structure and provide recommendations:

Trust Name: ${workbook.trustName}
Trust Type: ${workbook.trustType}
Jurisdiction: ${workbook.jurisdiction || "Not specified"}
Estimated Asset Value: $${((workbook.estimatedAssetValue || 0) / 100).toLocaleString()}
Asset Protection Goals: ${workbook.assetProtectionGoals || "Not specified"}

Grantor: ${JSON.stringify(workbook.grantorInfo || {})}
Trustee: ${JSON.stringify(workbook.trusteeInfo || {})}
Beneficiaries (${workbook.beneficiaries?.length || 0}): ${JSON.stringify(
                workbook.beneficiaries?.map((b) => ({
                  name: b.fullName,
                  type: b.beneficiaryType,
                  percentage: b.distributionPercentage,
                })) || []
              )}

Provide analysis on:
1. Tax efficiency and optimization strategies
2. Asset protection strength
3. Beneficiary structure recommendations
4. Jurisdiction advantages/disadvantages
5. Distribution rule suggestions
6. Potential risks and mitigation strategies`,
            },
          ],
        });

        return { analysis: response.choices[0].message.content };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to generate analysis",
        });
      }
    }),

  // Get jurisdiction comparison
  getJurisdictionInfo: protectedProcedure.query(async () => {
    return {
      south_dakota: {
        name: "South Dakota",
        advantages: [
          "No state income tax",
          "Perpetual dynasty trusts (no Rule Against Perpetuities)",
          "Strong asset protection laws",
          "Favorable decanting statutes",
          "Privacy protections",
        ],
        considerations: ["Must have SD trustee", "Annual fees"],
      },
      nevada: {
        name: "Nevada",
        advantages: [
          "No state income tax",
          "365-year dynasty trust duration",
          "Strong asset protection",
          "Privacy protections",
          "Flexible trust modification",
        ],
        considerations: ["Must have NV trustee", "Higher costs than some states"],
      },
      delaware: {
        name: "Delaware",
        advantages: [
          "No state income tax on out-of-state beneficiaries",
          "Perpetual trusts allowed",
          "Directed trustee options",
          "Strong case law",
          "Business-friendly",
        ],
        considerations: ["Must have DE trustee", "Some state taxes may apply"],
      },
      other: {
        name: "Other Jurisdictions",
        advantages: ["May have local advantages", "Potentially lower costs"],
        considerations: [
          "Research state-specific laws",
          "May have less favorable trust laws",
          "Consult with local attorney",
        ],
      },
    };
  }),
});
