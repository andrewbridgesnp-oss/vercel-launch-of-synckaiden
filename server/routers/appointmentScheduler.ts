import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { appointmentSchedulerServices, appointmentSchedulerAppointments, type InsertAppointmentSchedulerService, type InsertAppointmentSchedulerAppointment } from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const appointmentSchedulerRouter = router({
  // ============= SERVICES =============
  getServices: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db.select().from(appointmentSchedulerServices).where(eq(appointmentSchedulerServices.userId, ctx.user.id)).orderBy(appointmentSchedulerServices.name);
  }),

  createService: protectedProcedure.input(z.object({ name: z.string().min(1).max(255), description: z.string().optional(), duration: z.number().int().positive(), price: z.number().int().positive().optional(), color: z.string().max(7).optional(), isActive: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const [service] = await db.insert(appointmentSchedulerServices).values({ userId: ctx.user.id, ...input } as InsertAppointmentSchedulerService).$returningId();
    return service;
  }),

  updateService: protectedProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(1).max(255).optional(), description: z.string().optional(), duration: z.number().int().positive().optional(), price: z.number().int().positive().optional(), color: z.string().max(7).optional(), isActive: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const { id, ...updates } = input;
    await db.update(appointmentSchedulerServices).set(updates).where(and(eq(appointmentSchedulerServices.id, id), eq(appointmentSchedulerServices.userId, ctx.user.id)));
    return { success: true };
  }),

  deleteService: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(appointmentSchedulerServices).where(and(eq(appointmentSchedulerServices.id, input.id), eq(appointmentSchedulerServices.userId, ctx.user.id)));
    return { success: true };
  }),

  // ============= APPOINTMENTS =============
  getAppointments: protectedProcedure.input(z.object({ startDate: z.string().optional(), endDate: z.string().optional(), serviceId: z.number().int().positive().optional(), status: z.enum(["scheduled", "confirmed", "cancelled", "completed", "no_show"]).optional() })).query(async ({ ctx, input }) => {
    const db = getDb();
    let query = db.select().from(appointmentSchedulerAppointments).where(eq(appointmentSchedulerAppointments.userId, ctx.user.id));
    if (input.startDate) query = query.where(gte(appointmentSchedulerAppointments.startTime, new Date(input.startDate)));
    if (input.endDate) query = query.where(lte(appointmentSchedulerAppointments.startTime, new Date(input.endDate)));
    if (input.serviceId) query = query.where(eq(appointmentSchedulerAppointments.serviceId, input.serviceId));
    if (input.status) query = query.where(eq(appointmentSchedulerAppointments.status, input.status));
    return await query.orderBy(appointmentSchedulerAppointments.startTime);
  }),

  createAppointment: protectedProcedure.input(z.object({ serviceId: z.number().int().positive(), clientName: z.string().min(1).max(255), clientEmail: z.string().email(), clientPhone: z.string().max(20).optional(), startTime: z.string(), endTime: z.string(), notes: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const [appointment] = await db.insert(appointmentSchedulerAppointments).values({ userId: ctx.user.id, ...input, startTime: new Date(input.startTime), endTime: new Date(input.endTime) } as InsertAppointmentSchedulerAppointment).$returningId();
    return appointment;
  }),

  updateAppointment: protectedProcedure.input(z.object({ id: z.number().int().positive(), serviceId: z.number().int().positive().optional(), clientName: z.string().min(1).max(255).optional(), clientEmail: z.string().email().optional(), clientPhone: z.string().max(20).optional(), startTime: z.string().optional(), endTime: z.string().optional(), status: z.enum(["scheduled", "confirmed", "cancelled", "completed", "no_show"]).optional(), notes: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    const { id, ...updates } = input;
    const updateData: any = { ...updates };
    if (updates.startTime) updateData.startTime = new Date(updates.startTime);
    if (updates.endTime) updateData.endTime = new Date(updates.endTime);
    await db.update(appointmentSchedulerAppointments).set(updateData).where(and(eq(appointmentSchedulerAppointments.id, id), eq(appointmentSchedulerAppointments.userId, ctx.user.id)));
    return { success: true };
  }),

  deleteAppointment: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = getDb();
    await db.delete(appointmentSchedulerAppointments).where(and(eq(appointmentSchedulerAppointments.id, input.id), eq(appointmentSchedulerAppointments.userId, ctx.user.id)));
    return { success: true };
  }),
});
