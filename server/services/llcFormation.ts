import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { llcFormations, llcDocuments, stateRequirements } from "../../drizzle/schema";
import type { InsertLlcFormation, InsertLlcDocument, InsertStateRequirement } from "../../drizzle/schema";

/**
 * LLC Formation Service
 * 
 * Handles all database operations for LLC formation wizard.
 * Premium $24.99/month service for state-specific LLC creation.
 */

// ============= LLC FORMATIONS =============

export async function getUserLlcFormations(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return await db
    .select()
    .from(llcFormations)
    .where(eq(llcFormations.userId, userId))
    .orderBy(desc(llcFormations.createdAt));
}

export async function getLlcFormationById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [formation] = await db
    .select()
    .from(llcFormations)
    .where(and(eq(llcFormations.id, id), eq(llcFormations.userId, userId)));

  if (!formation) {
    return null;
  }

  // Get associated documents
  const documents = await db
    .select()
    .from(llcDocuments)
    .where(eq(llcDocuments.llcFormationId, id))
    .orderBy(desc(llcDocuments.createdAt));

  return { ...formation, documents };
}

export async function createLlcFormation(data: InsertLlcFormation) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [formation] = await db.insert(llcFormations).values(data);
  return formation;
}

export async function updateLlcFormation(id: number, userId: number, updates: Partial<InsertLlcFormation>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(llcFormations)
    .where(and(eq(llcFormations.id, id), eq(llcFormations.userId, userId)));

  if (!existing) {
    throw new Error("LLC formation not found");
  }

  await db.update(llcFormations).set(updates).where(eq(llcFormations.id, id));

  return { success: true };
}

export async function deleteLlcFormation(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(llcFormations)
    .where(and(eq(llcFormations.id, id), eq(llcFormations.userId, userId)));

  if (!existing) {
    throw new Error("LLC formation not found");
  }

  // Delete associated documents first
  await db.delete(llcDocuments).where(eq(llcDocuments.llcFormationId, id));

  // Delete formation
  await db.delete(llcFormations).where(eq(llcFormations.id, id));

  return { success: true };
}

// ============= LLC DOCUMENTS =============

export async function getLlcDocuments(llcFormationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership of parent formation
  const [formation] = await db
    .select()
    .from(llcFormations)
    .where(and(eq(llcFormations.id, llcFormationId), eq(llcFormations.userId, userId)));

  if (!formation) {
    throw new Error("LLC formation not found");
  }

  return await db
    .select()
    .from(llcDocuments)
    .where(eq(llcDocuments.llcFormationId, llcFormationId))
    .orderBy(desc(llcDocuments.createdAt));
}

export async function createLlcDocument(data: InsertLlcDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [document] = await db.insert(llcDocuments).values(data);
  return document;
}

export async function updateLlcDocument(
  id: number,
  userId: number,
  updates: Partial<InsertLlcDocument>
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get document and verify ownership through parent formation
  const [document] = await db.select().from(llcDocuments).where(eq(llcDocuments.id, id));

  if (!document) {
    throw new Error("Document not found");
  }

  const [formation] = await db
    .select()
    .from(llcFormations)
    .where(
      and(eq(llcFormations.id, document.llcFormationId), eq(llcFormations.userId, userId))
    );

  if (!formation) {
    throw new Error("Access denied");
  }

  await db.update(llcDocuments).set(updates).where(eq(llcDocuments.id, id));

  return { success: true };
}

export async function deleteLlcDocument(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get document and verify ownership
  const [document] = await db.select().from(llcDocuments).where(eq(llcDocuments.id, id));

  if (!document) {
    throw new Error("Document not found");
  }

  const [formation] = await db
    .select()
    .from(llcFormations)
    .where(
      and(eq(llcFormations.id, document.llcFormationId), eq(llcFormations.userId, userId))
    );

  if (!formation) {
    throw new Error("Access denied");
  }

  await db.delete(llcDocuments).where(eq(llcDocuments.id, id));

  return { success: true };
}

// ============= STATE REQUIREMENTS =============

export async function getStateRequirements(stateCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [requirements] = await db
    .select()
    .from(stateRequirements)
    .where(eq(stateRequirements.state, stateCode));

  return requirements || null;
}

export async function getAllStateRequirements() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return await db.select().from(stateRequirements);
}

export async function createStateRequirement(data: InsertStateRequirement) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [requirement] = await db.insert(stateRequirements).values(data);
  return requirement;
}

export async function updateStateRequirement(stateCode: string, updates: Partial<InsertStateRequirement>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  await db.update(stateRequirements).set(updates).where(eq(stateRequirements.state, stateCode));

  return { success: true };
}
