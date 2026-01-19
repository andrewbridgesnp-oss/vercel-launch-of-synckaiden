import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
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

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.status, 'active')).orderBy(products.sortOrder);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
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
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
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
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  
  return await query;
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
