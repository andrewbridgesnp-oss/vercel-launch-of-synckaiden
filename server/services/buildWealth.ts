import { eq, and, desc, gte, lte } from "drizzle-orm";
import { getDb } from "../db";
import { wealthAccounts, wealthTransactions, wealthGoals } from "../../drizzle/schema";
import type { InsertWealthAccount, InsertWealthTransaction, InsertWealthGoal } from "../../drizzle/schema";

/**
 * BuildWealth Pro Service
 * 
 * $14.99/month investment tracking, wealth building strategies, and financial goal planning.
 */

// ============= ACCOUNTS =============

export async function getUserAccounts(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return await db
    .select()
    .from(wealthAccounts)
    .where(eq(wealthAccounts.userId, userId))
    .orderBy(desc(wealthAccounts.createdAt));
}

export async function getAccountById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [account] = await db
    .select()
    .from(wealthAccounts)
    .where(and(eq(wealthAccounts.id, id), eq(wealthAccounts.userId, userId)));

  if (!account) {
    return null;
  }

  // Get recent transactions
  const transactions = await db
    .select()
    .from(wealthTransactions)
    .where(eq(wealthTransactions.accountId, id))
    .orderBy(desc(wealthTransactions.transactionDate))
    .limit(50);

  return { ...account, transactions };
}

export async function createAccount(data: InsertWealthAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [account] = await db.insert(wealthAccounts).values(data);
  return account;
}

export async function updateAccount(id: number, userId: number, updates: Partial<InsertWealthAccount>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(wealthAccounts)
    .where(and(eq(wealthAccounts.id, id), eq(wealthAccounts.userId, userId)));

  if (!existing) {
    throw new Error("Account not found");
  }

  await db.update(wealthAccounts).set(updates).where(eq(wealthAccounts.id, id));

  return { success: true };
}

export async function deleteAccount(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(wealthAccounts)
    .where(and(eq(wealthAccounts.id, id), eq(wealthAccounts.userId, userId)));

  if (!existing) {
    throw new Error("Account not found");
  }

  // Delete transactions first
  await db.delete(wealthTransactions).where(eq(wealthTransactions.accountId, id));

  // Delete account
  await db.delete(wealthAccounts).where(eq(wealthAccounts.id, id));

  return { success: true };
}

// ============= TRANSACTIONS =============

export async function addTransaction(data: InsertWealthTransaction, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify account ownership
  const [account] = await db
    .select()
    .from(wealthAccounts)
    .where(and(eq(wealthAccounts.id, data.accountId), eq(wealthAccounts.userId, userId)));

  if (!account) {
    throw new Error("Account not found");
  }

  const [transaction] = await db.insert(wealthTransactions).values(data);

  // Update account balance
  let newBalance = account.currentBalance;
  if (["contribution", "dividend", "interest", "capital_gain"].includes(data.transactionType)) {
    newBalance += data.amount;
  } else if (["withdrawal", "fee"].includes(data.transactionType)) {
    newBalance -= data.amount;
  }

  await db.update(wealthAccounts).set({ currentBalance: newBalance }).where(eq(wealthAccounts.id, data.accountId));

  return transaction;
}

export async function getTransactions(accountId: number, userId: number, options?: { startDate?: Date; endDate?: Date; limit?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify account ownership
  const [account] = await db
    .select()
    .from(wealthAccounts)
    .where(and(eq(wealthAccounts.id, accountId), eq(wealthAccounts.userId, userId)));

  if (!account) {
    throw new Error("Account not found");
  }

  let query = db.select().from(wealthTransactions).where(eq(wealthTransactions.accountId, accountId));

  if (options?.startDate) {
    query = query.where(gte(wealthTransactions.transactionDate, options.startDate)) as any;
  }

  if (options?.endDate) {
    query = query.where(lte(wealthTransactions.transactionDate, options.endDate)) as any;
  }

  const transactions = await query.orderBy(desc(wealthTransactions.transactionDate)).limit(options?.limit || 100);

  return transactions;
}

// ============= GOALS =============

export async function getUserGoals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  return await db
    .select()
    .from(wealthGoals)
    .where(eq(wealthGoals.userId, userId))
    .orderBy(desc(wealthGoals.createdAt));
}

export async function createGoal(data: InsertWealthGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [goal] = await db.insert(wealthGoals).values(data);
  return goal;
}

export async function updateGoal(id: number, userId: number, updates: Partial<InsertWealthGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(wealthGoals)
    .where(and(eq(wealthGoals.id, id), eq(wealthGoals.userId, userId)));

  if (!existing) {
    throw new Error("Goal not found");
  }

  await db.update(wealthGoals).set(updates).where(eq(wealthGoals.id, id));

  return { success: true };
}

export async function deleteGoal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Verify ownership
  const [existing] = await db
    .select()
    .from(wealthGoals)
    .where(and(eq(wealthGoals.id, id), eq(wealthGoals.userId, userId)));

  if (!existing) {
    throw new Error("Goal not found");
  }

  await db.delete(wealthGoals).where(eq(wealthGoals.id, id));

  return { success: true };
}

// ============= ANALYTICS =============

export async function getPortfolioSummary(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const accounts = await db.select().from(wealthAccounts).where(eq(wealthAccounts.userId, userId));

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  const accountsByType = accounts.reduce((acc, account) => {
    acc[account.accountType] = (acc[account.accountType] || 0) + account.currentBalance;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalBalance,
    accountCount: accounts.length,
    accountsByType,
    accounts,
  };
}
