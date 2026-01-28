import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';
import { 
  InsertUser, users, profiles, products, prices, subscriptions, entitlements,
  payments, webhookEvents, userApiKeys, auditLogs, appRegistry,
  boutiqueProducts, boutiqueOrders, boutiqueOrderItems, boutiqueCart,
  youtubeChannels, youtubeVideos, youtubeAnalytics,
  videoDrafts, postPlans, trendItems, affiliateOffers, platformCredentials, brandSettings,
  referrals, reviews, emailNotifications, smsNotifications,
  type User, type Product, type Subscription, type Entitlement, type WebhookEvent,
  type AuditLog, type UserApiKey
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;
let _connectionRetries = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Initialize database connection pool with retry logic
 * This should be called at application startup
 */
export async function initializeDatabase(): Promise<void> {
  if (_db && _pool) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    const errorMessage = "[Database] DATABASE_URL environment variable is not set. Database initialization failed.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  while (_connectionRetries < MAX_RETRIES) {
    try {
      console.log("[Database] Initializing connection pool...");
      
      // Create connection pool for better performance
      _pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Test connection
      const connection = await _pool.getConnection();
      await connection.ping();
      connection.release();

      _db = drizzle(_pool);
      console.log("[Database] Connection pool initialized successfully");
      _connectionRetries = 0; // Reset on successful connection
      return;
    } catch (error) {
      _connectionRetries++;
      console.error(`[Database] Connection attempt ${_connectionRetries}/${MAX_RETRIES} failed:`, error);
      
      if (_connectionRetries >= MAX_RETRIES) {
        console.error("[Database] Max retries reached. Database will be unavailable.");
        _db = null;
        _pool = null;
        _connectionRetries = 0; // Reset for future attempts
        return;
      }
      
      // Linear backoff: 1s, 2s, 3s
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * _connectionRetries));
    }
  }
}

/**
 * Get database instance. For backwards compatibility, this function
 * attempts to initialize the database if not already done.
 * @deprecated Use initializeDatabase() at startup instead
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    await initializeDatabase();
  }
  return _db;
}

/**
 * Gracefully close database connections
 */
export async function closeDatabase(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
    console.log("[Database] Connection pool closed");
  }
}

// ============= USER & PROFILE HELPERS =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.personalityType !== undefined) {
      values.personalityType = user.personalityType;
      updateSet.personalityType = user.personalityType;
    }
    if (user.smsOptIn !== undefined) {
      values.smsOptIn = user.smsOptIn;
      updateSet.smsOptIn = user.smsOptIn;
    }
    if (user.emailOptIn !== undefined) {
      values.emailOptIn = user.emailOptIn;
      updateSet.emailOptIn = user.emailOptIn;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= PRODUCT & PRICING HELPERS =============

// Cache imported modules to avoid repeated dynamic imports
let cacheModule: any = null;

async function getCacheModule() {
  if (!cacheModule) {
    cacheModule = await import('./_core/cache');
  }
  return cacheModule;
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  const { cache, allProductsCacheKey } = await getCacheModule();
  
  return cache.getOrSet(
    allProductsCacheKey(),
    async () => {
      return await db.select().from(products).where(eq(products.status, 'active')).orderBy(products.sortOrder);
    },
    300 // Cache for 5 minutes
  );
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { cache, productCacheKey } = await getCacheModule();
  
  return cache.getOrSet(
    productCacheKey(`slug:${slug}`),
    async () => {
      const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    },
    600 // Cache for 10 minutes
  );
}

export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { cache, productCacheKey } = await getCacheModule();
  
  return cache.getOrSet(
    productCacheKey(productId),
    async () => {
      const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    },
    600 // Cache for 10 minutes
  );
}

export async function getPricesByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(prices).where(and(
    eq(prices.productId, productId),
    eq(prices.active, true)
  ));
}

export async function getPriceById(priceId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(prices).where(eq(prices.id, priceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= SUBSCRIPTION HELPERS =============

export async function createSubscription(data: {
  userId: number;
  productId: number;
  priceId: number;
  provider: 'stripe' | 'paypal';
  providerSubscriptionId: string;
  providerCustomerId?: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  metadata?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(subscriptions).values(data);
  return result;
}

export async function getSubscriptionByProviderId(providerSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, providerSubscriptionId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));
}

export async function updateSubscription(subscriptionId: number, data: Partial<typeof subscriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptions).set(data).where(eq(subscriptions.id, subscriptionId));
}

// ============= ENTITLEMENT HELPERS =============

export async function createEntitlement(data: {
  userId: number;
  productId: number;
  subscriptionId?: number;
  grantedBy: 'subscription' | 'bundle' | 'admin' | 'trial';
  status?: 'active' | 'expired' | 'revoked';
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(entitlements).values(data);
  return result;
}

export async function getUserEntitlements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(entitlements)
    .where(and(
      eq(entitlements.userId, userId),
      eq(entitlements.status, 'active')
    ));
}

export async function checkUserEntitlement(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(entitlements)
    .where(and(
      eq(entitlements.userId, userId),
      eq(entitlements.productId, productId),
      eq(entitlements.status, 'active')
    ))
    .limit(1);
  
  return result.length > 0;
}

export async function revokeEntitlement(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(entitlements)
    .set({ status: 'revoked', updatedAt: new Date() })
    .where(and(
      eq(entitlements.userId, userId),
      eq(entitlements.productId, productId)
    ));
}

// ============= PAYMENT HELPERS =============

export async function createPayment(data: {
  userId?: number;
  amount: number;
  currency?: string;
  provider: 'stripe' | 'paypal' | 'square';
  providerPaymentId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  productType: 'subscription' | 'app' | 'bundle' | 'digital_product';
  productId?: number;
  subscriptionId?: number;
  metadata?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(data);
  return result;
}

export async function getPaymentByProviderId(providerPaymentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(payments)
    .where(eq(payments.providerPaymentId, providerPaymentId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserPayments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
}

// ============= WEBHOOK HELPERS =============

export async function createWebhookEvent(data: {
  provider: 'stripe' | 'paypal' | 'printful';
  eventId: string;
  eventType: string;
  payload: any;
  processed?: boolean;
  error?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(webhookEvents).values(data);
    return result;
  } catch (error: any) {
    // If duplicate event ID, return existing
    if (error.code === 'ER_DUP_ENTRY') {
      const existing = await db.select().from(webhookEvents)
        .where(eq(webhookEvents.eventId, data.eventId))
        .limit(1);
      return existing[0];
    }
    throw error;
  }
}

export async function getWebhookEventByEventId(eventId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(webhookEvents)
    .where(eq(webhookEvents.eventId, eventId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markWebhookProcessed(eventId: string, error?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(webhookEvents)
    .set({ 
      processed: true, 
      processedAt: new Date(),
      error: error || null
    })
    .where(eq(webhookEvents.eventId, eventId));
}

// ============= AUDIT LOG HELPERS =============

export async function createAuditLog(data: {
  userId?: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'info' | 'warning' | 'critical';
}) {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(auditLogs).values(data);
  } catch (error) {
    console.error("[Audit] Failed to create audit log:", error);
  }
}

export async function getAuditLogs(filters?: {
  userId?: number;
  action?: string;
  resource?: string;
  severity?: 'info' | 'warning' | 'critical';
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return { logs: [], meta: { page: 1, limit: 30, hasMore: false } };
  
  const { page, limit, offset } = getPaginationParams({ 
    page: filters?.page, 
    limit: filters?.limit 
  });
  
  let query = db.select().from(auditLogs);
  
  if (filters?.userId) {
    query = query.where(eq(auditLogs.userId, filters.userId)) as any;
  }
  if (filters?.action) {
    query = query.where(eq(auditLogs.action, filters.action)) as any;
  }
  if (filters?.resource) {
    query = query.where(eq(auditLogs.resource, filters.resource)) as any;
  }
  if (filters?.severity) {
    query = query.where(eq(auditLogs.severity, filters.severity)) as any;
  }
  
  query = query.orderBy(desc(auditLogs.createdAt)) as any;
  
  // Fetch one extra to check if there are more pages
  const logs = await query.limit(limit + 1).offset(offset);
  const hasMore = logs.length > limit;
  if (hasMore) logs.pop();
  
  return {
    logs,
    meta: {
      page,
      limit,
      hasMore,
    },
  };
}

// ============= API KEY VAULT HELPERS =============

export async function createUserApiKey(data: {
  userId: number;
  service: string;
  keyName: string;
  encryptedKey: string;
  iv: string;
  active?: boolean;
  expiresAt?: Date;
  metadata?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userApiKeys).values(data);
  return result;
}

export async function getUserApiKey(userId: number, service: string, keyName: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userApiKeys)
    .where(and(
      eq(userApiKeys.userId, userId),
      eq(userApiKeys.service, service),
      eq(userApiKeys.keyName, keyName),
      eq(userApiKeys.active, true)
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserApiKeys(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userApiKeys)
    .where(and(
      eq(userApiKeys.userId, userId),
      eq(userApiKeys.active, true)
    ))
    .orderBy(desc(userApiKeys.createdAt));
}

export async function updateApiKeyLastUsed(keyId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(userApiKeys)
    .set({ lastUsed: new Date() })
    .where(eq(userApiKeys.id, keyId));
}

export async function deactivateUserApiKey(userId: number, service: string, keyName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userApiKeys)
    .set({ active: false, updatedAt: new Date() })
    .where(and(
      eq(userApiKeys.userId, userId),
      eq(userApiKeys.service, service),
      eq(userApiKeys.keyName, keyName)
    ));
}

// ============= APP REGISTRY HELPERS =============

export async function getAllApps() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(appRegistry)
    .where(eq(appRegistry.status, 'active'))
    .orderBy(appRegistry.name);
}

export async function getAppBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(appRegistry)
    .where(eq(appRegistry.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= BOUGIE BOUTIQUE HELPERS =============

export async function getBoutiqueProducts(filters?: {
  category?: string;
  active?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(boutiqueProducts);
  
  if (filters?.category) {
    query = query.where(eq(boutiqueProducts.category, filters.category)) as any;
  }
  if (filters?.active !== undefined) {
    query = query.where(eq(boutiqueProducts.active, filters.active)) as any;
  }
  
  return await query;
}

export async function getBoutiqueProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(boutiqueProducts)
    .where(eq(boutiqueProducts.id, productId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCart(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(boutiqueCart)
    .where(eq(boutiqueCart.userId, userId));
}

export async function createBoutiqueOrder(data: {
  userId: number;
  orderNumber: string;
  status?: string;
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  currency?: string;
  paymentProvider: 'stripe' | 'paypal';
  paymentId?: string;
  shippingAddress?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(boutiqueOrders).values(data as any);
  return result;
}

export async function getBoutiqueOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(boutiqueOrders)
    .where(eq(boutiqueOrders.userId, userId))
    .orderBy(desc(boutiqueOrders.createdAt));
}

export async function getBoutiqueOrderById(orderId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(boutiqueOrders)
    .where(and(
      eq(boutiqueOrders.id, orderId),
      eq(boutiqueOrders.userId, userId)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ============= YOUTUBE AUTOMATION HELPERS =============

export async function getUserYoutubeChannels(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(youtubeChannels)
    .where(and(
      eq(youtubeChannels.userId, userId),
      eq(youtubeChannels.active, true)
    ));
}

export async function getUserYoutubeVideos(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(youtubeVideos)
    .where(eq(youtubeVideos.userId, userId))
    .orderBy(desc(youtubeVideos.createdAt));
}

// ============= SOCIAL MEDIA AUTOPILOT HELPERS =============

export async function getUserVideoDrafts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(videoDrafts)
    .where(eq(videoDrafts.userId, userId))
    .orderBy(desc(videoDrafts.createdAt));
}

export async function getPendingVideoDrafts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(videoDrafts)
    .where(and(
      eq(videoDrafts.userId, userId),
      eq(videoDrafts.status, 'pending')
    ))
    .orderBy(desc(videoDrafts.createdAt));
}

export async function getScheduledPostPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(postPlans)
    .where(and(
      eq(postPlans.userId, userId),
      eq(postPlans.status, 'scheduled')
    ))
    .orderBy(postPlans.scheduledFor);
}

// ============= PERFORMANCE UTILITIES =============

/**
 * Pagination helper to add consistent limit/offset to queries
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}

export function getPaginationParams(params?: PaginationParams) {
  const page = Math.max(1, params?.page || 1);
  const limit = Math.min(100, Math.max(1, params?.limit || 30));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

/**
 * Execute a database transaction
 * @param callback Function that receives the database instance and performs operations
 * @returns Result of the transaction
 * 
 * @example
 * await withTransaction(async (tx) => {
 *   await tx.insert(subscriptions).values(subData);
 *   await tx.insert(entitlements).values(entData);
 *   return { success: true };
 * });
 */
export async function withTransaction<T>(
  callback: (tx: NonNullable<Awaited<ReturnType<typeof getDb>>>) => Promise<T>
): Promise<T> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  return await db.transaction(callback);
}
