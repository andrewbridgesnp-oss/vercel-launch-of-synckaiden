import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as wealthService from "../services/buildWealth";
import { invokeLLM } from "../_core/llm";

/**
 * BuildWealth Pro Router
 * 
 * $14.99/month investment tracking, wealth building strategies,
 * portfolio analysis, and financial goal planning.
 */

export const buildWealthRouter = router({
  // ============= ACCOUNTS =============

  listAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await wealthService.getUserAccounts(ctx.user.id);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch accounts",
      });
    }
  }),

  getAccount: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    try {
      const account = await wealthService.getAccountById(input.id, ctx.user.id);

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
      }

      return account;
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch account",
      });
    }
  }),

  createAccount: protectedProcedure
    .input(
      z.object({
        accountName: z.string().min(1),
        accountType: z.enum([
          "brokerage",
          "retirement_401k",
          "retirement_ira",
          "roth_ira",
          "hsa",
          "real_estate",
          "crypto",
          "other",
        ]),
        institution: z.string().optional(),
        accountNumber: z.string().optional(),
        currentBalance: z.number(),
        targetAllocation: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await wealthService.createAccount({
          userId: ctx.user.id,
          ...input,
          status: "active",
        });
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create account",
        });
      }
    }),

  updateAccount: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        accountName: z.string().optional(),
        institution: z.string().optional(),
        currentBalance: z.number().optional(),
        targetAllocation: z.any().optional(),
        status: z.enum(["active", "closed", "frozen"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updates } = input;
        await wealthService.updateAccount(id, ctx.user.id, updates);
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update account",
        });
      }
    }),

  deleteAccount: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await wealthService.deleteAccount(input.id, ctx.user.id);
      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete account",
      });
    }
  }),

  // ============= TRANSACTIONS =============

  addTransaction: protectedProcedure
    .input(
      z.object({
        accountId: z.number(),
        transactionType: z.enum([
          "contribution",
          "withdrawal",
          "dividend",
          "interest",
          "capital_gain",
          "fee",
          "transfer",
        ]),
        amount: z.number(),
        transactionDate: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        ticker: z.string().optional(),
        shares: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { transactionDate, ...rest } = input;

        return await wealthService.addTransaction(
          {
            ...rest,
            transactionDate: new Date(transactionDate),
          },
          ctx.user.id
        );
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to add transaction",
        });
      }
    }),

  getTransactions: protectedProcedure
    .input(
      z.object({
        accountId: z.number(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await wealthService.getTransactions(input.accountId, ctx.user.id, {
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          limit: input.limit,
        });
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch transactions",
        });
      }
    }),

  // ============= GOALS =============

  listGoals: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await wealthService.getUserGoals(ctx.user.id);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch goals",
      });
    }
  }),

  createGoal: protectedProcedure
    .input(
      z.object({
        goalName: z.string().min(1),
        goalType: z.enum(["retirement", "home_purchase", "education", "emergency_fund", "other"]),
        targetAmount: z.number(),
        currentAmount: z.number().optional(),
        targetDate: z.string().optional(),
        monthlyContribution: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { targetDate, ...rest } = input;

        return await wealthService.createGoal({
          userId: ctx.user.id,
          ...rest,
          currentAmount: input.currentAmount || 0,
          targetDate: targetDate ? new Date(targetDate) : undefined,
          status: "active",
        });
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create goal",
        });
      }
    }),

  updateGoal: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        goalName: z.string().optional(),
        targetAmount: z.number().optional(),
        currentAmount: z.number().optional(),
        targetDate: z.string().optional(),
        monthlyContribution: z.number().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "completed", "paused", "abandoned"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, targetDate, ...updates } = input;

        await wealthService.updateGoal(id, ctx.user.id, {
          ...updates,
          targetDate: targetDate ? new Date(targetDate) : undefined,
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to update goal",
        });
      }
    }),

  deleteGoal: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await wealthService.deleteGoal(input.id, ctx.user.id);
      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete goal",
      });
    }
  }),

  // ============= ANALYTICS & AI =============

  getPortfolioSummary: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await wealthService.getPortfolioSummary(ctx.user.id);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch portfolio summary",
      });
    }
  }),

  generateStrategy: protectedProcedure
    .input(
      z.object({
        age: z.number(),
        riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
        timeHorizon: z.number(),
        currentNetWorth: z.number(),
        annualIncome: z.number(),
        goals: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a certified financial planner specializing in wealth building strategies. Provide personalized, actionable investment advice.`,
            },
            {
              role: "user",
              content: `Create a comprehensive wealth building strategy for:

Age: ${input.age}
Risk Tolerance: ${input.riskTolerance}
Time Horizon: ${input.timeHorizon} years
Current Net Worth: $${(input.currentNetWorth / 100).toLocaleString()}
Annual Income: $${(input.annualIncome / 100).toLocaleString()}
Financial Goals: ${input.goals.join(", ")}

Provide:
1. Recommended asset allocation
2. Investment vehicle suggestions
3. Tax optimization strategies
4. Monthly savings targets
5. Milestone projections
6. Risk management recommendations`,
            },
          ],
        });

        return { strategy: response.choices[0].message.content };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to generate strategy",
        });
      }
    }),

  calculateGoalProjection: protectedProcedure
    .input(
      z.object({
        currentAmount: z.number(),
        monthlyContribution: z.number(),
        targetAmount: z.number(),
        annualReturn: z.number(),
        yearsToGoal: z.number(),
      })
    )
    .query(({ input }) => {
      const { currentAmount, monthlyContribution, targetAmount, annualReturn, yearsToGoal } = input;

      const monthlyRate = annualReturn / 100 / 12;
      const months = yearsToGoal * 12;

      // Future value calculation
      const futureValue =
        currentAmount * Math.pow(1 + monthlyRate, months) +
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

      const totalContributions = currentAmount + monthlyContribution * months;
      const totalGrowth = futureValue - totalContributions;

      const willReachGoal = futureValue >= targetAmount;
      const shortfall = willReachGoal ? 0 : targetAmount - futureValue;

      return {
        projectedAmount: Math.round(futureValue),
        totalContributions: Math.round(totalContributions),
        totalGrowth: Math.round(totalGrowth),
        willReachGoal,
        shortfall: Math.round(shortfall),
        monthsToGoal: months,
      };
    }),
});
