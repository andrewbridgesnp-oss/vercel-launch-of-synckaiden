import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { trustWorkbooks, trustBeneficiaries } from "../../drizzle/schema";
import type { InsertTrustWorkbook, InsertTrustBeneficiary } from "../../drizzle/schema";

/**
 * Dynasty Trust Workbook Service
 * 
 * Premium $24.99/month wealth planning tool for multi-generational asset protection.
 */

// ============= TRUST WORKBOOKS =============

export async function getUserTrustWorkbooks(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return await db
    .select()
    .from(trustWorkbooks)
    .where(eq(trustWorkbooks.userId, userId))
    .orderBy(desc(trustWorkbooks.createdAt));
}

export async function getTrustWorkbookById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [workbook] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, id), eq(trustWorkbooks.userId, userId)));

  if (!workbook) {
    return null;
  }

  // Get beneficiaries
  const beneficiaries = await db
    .select()
    .from(trustBeneficiaries)
    .where(eq(trustBeneficiaries.trustWorkbookId, id));

  return { ...workbook, beneficiaries };
}

export async function createTrustWorkbook(data: InsertTrustWorkbook) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [workbook] = await db.insert(trustWorkbooks).values(data);
  return workbook;
}

export async function updateTrustWorkbook(id: number, userId: number, updates: Partial<InsertTrustWorkbook>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, id), eq(trustWorkbooks.userId, userId)));

  if (!existing) {
    throw new Error("Trust workbook not found");
  }

  await db.update(trustWorkbooks).set(updates).where(eq(trustWorkbooks.id, id));

  return { success: true };
}

export async function deleteTrustWorkbook(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, id), eq(trustWorkbooks.userId, userId)));

  if (!existing) {
    throw new Error("Trust workbook not found");
  }

  // Delete beneficiaries first
  await db.delete(trustBeneficiaries).where(eq(trustBeneficiaries.trustWorkbookId, id));

  // Delete workbook
  await db.delete(trustWorkbooks).where(eq(trustWorkbooks.id, id));

  return { success: true };
}

// ============= BENEFICIARIES =============

export async function getTrustBeneficiaries(trustWorkbookId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership of workbook
  const [workbook] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, trustWorkbookId), eq(trustWorkbooks.userId, userId)));

  if (!workbook) {
    throw new Error("Trust workbook not found");
  }

  return await db
    .select()
    .from(trustBeneficiaries)
    .where(eq(trustBeneficiaries.trustWorkbookId, trustWorkbookId));
}

export async function createBeneficiary(data: InsertTrustBeneficiary, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership of workbook
  const [workbook] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, data.trustWorkbookId), eq(trustWorkbooks.userId, userId)));

  if (!workbook) {
    throw new Error("Trust workbook not found");
  }

  const [beneficiary] = await db.insert(trustBeneficiaries).values(data);
  return beneficiary;
}

export async function updateBeneficiary(id: number, userId: number, updates: Partial<InsertTrustBeneficiary>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get beneficiary and verify ownership through workbook
  const [beneficiary] = await db
    .select()
    .from(trustBeneficiaries)
    .where(eq(trustBeneficiaries.id, id));

  if (!beneficiary) {
    throw new Error("Beneficiary not found");
  }

  const [workbook] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, beneficiary.trustWorkbookId), eq(trustWorkbooks.userId, userId)));

  if (!workbook) {
    throw new Error("Access denied");
  }

  await db.update(trustBeneficiaries).set(updates).where(eq(trustBeneficiaries.id, id));

  return { success: true };
}

export async function deleteBeneficiary(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get beneficiary and verify ownership
  const [beneficiary] = await db
    .select()
    .from(trustBeneficiaries)
    .where(eq(trustBeneficiaries.id, id));

  if (!beneficiary) {
    throw new Error("Beneficiary not found");
  }

  const [workbook] = await db
    .select()
    .from(trustWorkbooks)
    .where(and(eq(trustWorkbooks.id, beneficiary.trustWorkbookId), eq(trustWorkbooks.userId, userId)));

  if (!workbook) {
    throw new Error("Access denied");
  }

  await db.delete(trustBeneficiaries).where(eq(trustBeneficiaries.id, id));

  return { success: true };
}
