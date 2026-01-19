import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { 
  employeeOsEmployees, 
  employeeOsPerformanceReviews, 
  employeeOsTimeTracking,
  employeeOsPayroll 
} from "../../drizzle/schema";
import { eq, and, desc, between } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const employeeOsRouter = router({
  // ============= EMPLOYEE MANAGEMENT =============
  
  createEmployee: protectedProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      hireDate: z.string(),
      salary: z.number().optional(),
      emergencyContact: z.object({
        name: z.string(),
        phone: z.string(),
        relationship: z.string(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [employee] = await db.insert(employeeOsEmployees).values({
        userId: ctx.user.id,
        ...input,
        hireDate: new Date(input.hireDate),
        emergencyContact: input.emergencyContact ? JSON.stringify(input.emergencyContact) : null,
      });
      return { success: true, employeeId: employee.insertId };
    }),

  getEmployees: protectedProcedure
    .input(z.object({
      status: z.enum(["active", "on_leave", "terminated"]).optional(),
      department: z.string().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(employeeOsEmployees.userId, ctx.user.id)];
      if (input.status) {
        conditions.push(eq(employeeOsEmployees.status, input.status));
      }
      if (input.department) {
        conditions.push(eq(employeeOsEmployees.department, input.department));
      }
      
      const employees = await db
        .select()
        .from(employeeOsEmployees)
        .where(and(...conditions))
        .orderBy(desc(employeeOsEmployees.createdAt))
        .limit(input.limit);
      
      return employees;
    }),

  updateEmployee: protectedProcedure
    .input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      salary: z.number().optional(),
      status: z.enum(["active", "on_leave", "terminated"]).optional(),
      emergencyContact: z.object({
        name: z.string(),
        phone: z.string(),
        relationship: z.string(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(employeeOsEmployees)
        .set({
          ...updates,
          emergencyContact: updates.emergencyContact ? JSON.stringify(updates.emergencyContact) : undefined,
        })
        .where(and(
          eq(employeeOsEmployees.id, id),
          eq(employeeOsEmployees.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  deleteEmployee: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(employeeOsEmployees)
        .where(and(
          eq(employeeOsEmployees.id, input.id),
          eq(employeeOsEmployees.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // ============= PERFORMANCE REVIEWS =============
  
  createPerformanceReview: protectedProcedure
    .input(z.object({
      employeeId: z.number(),
      reviewDate: z.string(),
      reviewPeriodStart: z.string(),
      reviewPeriodEnd: z.string(),
      overallRating: z.number().min(1).max(5),
      strengths: z.string().optional(),
      areasForImprovement: z.string().optional(),
      goals: z.array(z.object({
        goal: z.string(),
        deadline: z.string(),
      })).optional(),
      reviewerNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [review] = await db.insert(employeeOsPerformanceReviews).values({
        userId: ctx.user.id,
        ...input,
        reviewDate: new Date(input.reviewDate),
        reviewPeriodStart: new Date(input.reviewPeriodStart),
        reviewPeriodEnd: new Date(input.reviewPeriodEnd),
        goals: input.goals ? JSON.stringify(input.goals) : null,
      });
      return { success: true, reviewId: review.insertId };
    }),

  getPerformanceReviews: protectedProcedure
    .input(z.object({
      employeeId: z.number().optional(),
      status: z.enum(["draft", "completed", "acknowledged"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(employeeOsPerformanceReviews.userId, ctx.user.id)];
      if (input.employeeId) {
        conditions.push(eq(employeeOsPerformanceReviews.employeeId, input.employeeId));
      }
      if (input.status) {
        conditions.push(eq(employeeOsPerformanceReviews.status, input.status));
      }
      
      const reviews = await db
        .select()
        .from(employeeOsPerformanceReviews)
        .where(and(...conditions))
        .orderBy(desc(employeeOsPerformanceReviews.reviewDate))
        .limit(input.limit);
      
      return reviews;
    }),

  updatePerformanceReview: protectedProcedure
    .input(z.object({
      id: z.number(),
      overallRating: z.number().min(1).max(5).optional(),
      strengths: z.string().optional(),
      areasForImprovement: z.string().optional(),
      goals: z.array(z.object({
        goal: z.string(),
        deadline: z.string(),
      })).optional(),
      reviewerNotes: z.string().optional(),
      employeeComments: z.string().optional(),
      status: z.enum(["draft", "completed", "acknowledged"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(employeeOsPerformanceReviews)
        .set({
          ...updates,
          goals: updates.goals ? JSON.stringify(updates.goals) : undefined,
        })
        .where(and(
          eq(employeeOsPerformanceReviews.id, id),
          eq(employeeOsPerformanceReviews.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= TIME TRACKING =============
  
  clockIn: protectedProcedure
    .input(z.object({
      employeeId: z.number(),
      clockIn: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const clockInTime = new Date(input.clockIn);
      
      const [timeEntry] = await db.insert(employeeOsTimeTracking).values({
        userId: ctx.user.id,
        employeeId: input.employeeId,
        date: clockInTime,
        clockIn: clockInTime,
        notes: input.notes,
      });
      return { success: true, timeEntryId: timeEntry.insertId };
    }),

  clockOut: protectedProcedure
    .input(z.object({
      timeEntryId: z.number(),
      clockOut: z.string(),
      breakMinutes: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const clockOutTime = new Date(input.clockOut);
      
      // Get the time entry to calculate hours
      const [timeEntry] = await db
        .select()
        .from(employeeOsTimeTracking)
        .where(and(
          eq(employeeOsTimeTracking.id, input.timeEntryId),
          eq(employeeOsTimeTracking.userId, ctx.user.id)
        ))
        .limit(1);
      
      if (!timeEntry) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Time entry not found" });
      }
      
      const clockInTime = new Date(timeEntry.clockIn);
      const totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60);
      const workMinutes = totalMinutes - input.breakMinutes;
      const totalHours = (workMinutes / 60).toFixed(2);
      const overtimeHours = Math.max(0, parseFloat(totalHours) - 8).toFixed(2);
      
      await db
        .update(employeeOsTimeTracking)
        .set({
          clockOut: clockOutTime,
          breakMinutes: input.breakMinutes,
          totalHours: totalHours,
          overtimeHours: overtimeHours,
        })
        .where(eq(employeeOsTimeTracking.id, input.timeEntryId));
      
      return { success: true, totalHours, overtimeHours };
    }),

  getTimeTracking: protectedProcedure
    .input(z.object({
      employeeId: z.number().optional(),
      startDate: z.string(),
      endDate: z.string(),
      limit: z.number().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [
        eq(employeeOsTimeTracking.userId, ctx.user.id),
        between(employeeOsTimeTracking.date, new Date(input.startDate), new Date(input.endDate)),
      ];
      if (input.employeeId) {
        conditions.push(eq(employeeOsTimeTracking.employeeId, input.employeeId));
      }
      
      const timeEntries = await db
        .select()
        .from(employeeOsTimeTracking)
        .where(and(...conditions))
        .orderBy(desc(employeeOsTimeTracking.date))
        .limit(input.limit);
      
      return timeEntries;
    }),

  // ============= PAYROLL =============
  
  createPayroll: protectedProcedure
    .input(z.object({
      employeeId: z.number(),
      payPeriodStart: z.string(),
      payPeriodEnd: z.string(),
      grossPay: z.number(),
      deductions: z.object({
        federalTax: z.number(),
        stateTax: z.number(),
        socialSecurity: z.number(),
        medicare: z.number(),
        insurance: z.number().optional(),
        retirement: z.number().optional(),
      }),
      paymentMethod: z.enum(["direct_deposit", "check", "cash"]),
      paymentDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      const totalDeductions = Object.values(input.deductions).reduce((sum, val) => sum + (val || 0), 0);
      const netPay = input.grossPay - totalDeductions;
      
      const [payroll] = await db.insert(employeeOsPayroll).values({
        userId: ctx.user.id,
        employeeId: input.employeeId,
        payPeriodStart: new Date(input.payPeriodStart),
        payPeriodEnd: new Date(input.payPeriodEnd),
        grossPay: input.grossPay,
        deductions: JSON.stringify(input.deductions),
        netPay,
        paymentMethod: input.paymentMethod,
        paymentDate: input.paymentDate ? new Date(input.paymentDate) : null,
      });
      return { success: true, payrollId: payroll.insertId, netPay };
    }),

  getPayroll: protectedProcedure
    .input(z.object({
      employeeId: z.number().optional(),
      status: z.enum(["pending", "processed", "paid"]).optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(employeeOsPayroll.userId, ctx.user.id)];
      if (input.employeeId) {
        conditions.push(eq(employeeOsPayroll.employeeId, input.employeeId));
      }
      if (input.status) {
        conditions.push(eq(employeeOsPayroll.status, input.status));
      }
      
      const payrollRecords = await db
        .select()
        .from(employeeOsPayroll)
        .where(and(...conditions))
        .orderBy(desc(employeeOsPayroll.payPeriodEnd))
        .limit(input.limit);
      
      return payrollRecords;
    }),

  updatePayrollStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processed", "paid"]),
      paymentDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      await db
        .update(employeeOsPayroll)
        .set({
          ...updates,
          paymentDate: updates.paymentDate ? new Date(updates.paymentDate) : undefined,
        })
        .where(and(
          eq(employeeOsPayroll.id, id),
          eq(employeeOsPayroll.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),

  // ============= AI FEATURES =============
  
  generatePerformanceReviewDraft: protectedProcedure
    .input(z.object({
      employeeName: z.string(),
      position: z.string(),
      department: z.string(),
      accomplishments: z.string(),
      challenges: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an HR professional writing constructive, balanced performance reviews that motivate employees and provide actionable feedback.",
          },
          {
            role: "user",
            content: `Generate a professional performance review for:\n\nEmployee: ${input.employeeName}\nPosition: ${input.position}\nDepartment: ${input.department}\n\nAccomplishments:\n${input.accomplishments}\n\n${input.challenges ? `Challenges:\n${input.challenges}\n\n` : ""}Include: Strengths, Areas for Improvement, and Development Goals.`,
          },
        ],
      });

      const reviewContent = response.choices[0]?.message?.content || "";
      return { reviewContent };
    }),
});
