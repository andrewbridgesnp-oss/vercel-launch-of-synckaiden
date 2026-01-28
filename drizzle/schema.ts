import { boolean, decimal, index, int, json, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

/**
 * SYNCKAIDEN UNIFIED PLATFORM - COMPLETE DATABASE SCHEMA
 * 
 * This schema supports:
 * - Multi-app SaaS platform with entitlement gating
 * - Dual payment processing (Stripe + PayPal)
 * - E-commerce with Printful fulfillment
 * - Encrypted API key vault
 * - Comprehensive audit logging
 * - Multiple business applications
 */

// ============= CORE USER & AUTH TABLES =============

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  personalityType: mysqlEnum("personalityType", ["visionary", "strategist", "executor"]),
  smsOptIn: boolean("smsOptIn").default(false),
  emailOptIn: boolean("emailOptIn").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  openIdIdx: index("openId_idx").on(table.openId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 500 }),
  company: varchar("company", { length: 255 }),
  website: varchar("website", { length: 500 }),
  location: varchar("location", { length: 255 }),
  timezone: varchar("timezone", { length: 50 }),
  preferences: json("preferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("profile_userId_idx").on(table.userId),
}));

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// ============= PRODUCT & PRICING TABLES =============

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["app", "bundle", "digital_product"]).notNull(),
  category: varchar("category", { length: 100 }),
  image: varchar("image", { length: 500 }),
  features: json("features"),
  requiredIntegrations: json("requiredIntegrations"),
  status: mysqlEnum("status", ["active", "inactive", "coming_soon"]).default("active").notNull(),
  sortOrder: int("sortOrder").default(0),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index("product_slug_idx").on(table.slug),
  typeIdx: index("product_type_idx").on(table.type),
  statusIdx: index("product_status_idx").on(table.status),
}));

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const prices = mysqlTable("prices", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  interval: mysqlEnum("interval", ["month", "year", "one_time"]).notNull(),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  paypalPlanId: varchar("paypalPlanId", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index("price_productId_idx").on(table.productId),
  stripePriceIdIdx: index("price_stripePriceId_idx").on(table.stripePriceId),
  paypalPlanIdIdx: index("price_paypalPlanId_idx").on(table.paypalPlanId),
}));

export type Price = typeof prices.$inferSelect;
export type InsertPrice = typeof prices.$inferInsert;

// ============= SUBSCRIPTION & ENTITLEMENT TABLES =============

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  priceId: int("priceId").notNull(),
  provider: mysqlEnum("provider", ["stripe", "paypal"]).notNull(),
  providerSubscriptionId: varchar("providerSubscriptionId", { length: 255 }).notNull(),
  providerCustomerId: varchar("providerCustomerId", { length: 255 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid", "trialing"]).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  canceledAt: timestamp("canceledAt"),
  trialStart: timestamp("trialStart"),
  trialEnd: timestamp("trialEnd"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("subscription_userId_idx").on(table.userId),
  productIdIdx: index("subscription_productId_idx").on(table.productId),
  statusIdx: index("subscription_status_idx").on(table.status),
  providerSubscriptionIdIdx: index("subscription_providerSubscriptionId_idx").on(table.providerSubscriptionId),
  // Composite index for common query: get active subscriptions by user
  userStatusIdx: index("subscription_userId_status_idx").on(table.userId, table.status),
}));

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export const entitlements = mysqlTable("entitlements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  subscriptionId: int("subscriptionId"),
  grantedBy: mysqlEnum("grantedBy", ["subscription", "bundle", "admin", "trial"]).notNull(),
  status: mysqlEnum("status", ["active", "expired", "revoked"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("entitlement_userId_idx").on(table.userId),
  productIdIdx: index("entitlement_productId_idx").on(table.productId),
  statusIdx: index("entitlement_status_idx").on(table.status),
  userProductUnique: unique("entitlement_user_product_unique").on(table.userId, table.productId),
  // Composite index for common query: check user entitlement for product
  userProductStatusIdx: index("entitlement_userId_productId_status_idx").on(table.userId, table.productId, table.status),
}));

export type Entitlement = typeof entitlements.$inferSelect;
export type InsertEntitlement = typeof entitlements.$inferInsert;

// ============= PAYMENT & WEBHOOK TABLES =============

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  provider: mysqlEnum("provider", ["stripe", "paypal", "square"]).notNull(),
  providerPaymentId: varchar("providerPaymentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  productType: mysqlEnum("productType", ["subscription", "app", "bundle", "digital_product"]).notNull(),
  productId: int("productId"),
  subscriptionId: int("subscriptionId"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("payment_userId_idx").on(table.userId),
  statusIdx: index("payment_status_idx").on(table.status),
  providerPaymentIdIdx: index("payment_providerPaymentId_idx").on(table.providerPaymentId),
}));

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export const webhookEvents = mysqlTable("webhookEvents", {
  id: int("id").autoincrement().primaryKey(),
  provider: mysqlEnum("provider", ["stripe", "paypal", "printful"]).notNull(),
  eventId: varchar("eventId", { length: 255 }).notNull().unique(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  payload: json("payload").notNull(),
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processedAt"),
  error: text("error"),
  retryCount: int("retryCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  eventIdIdx: index("webhook_eventId_idx").on(table.eventId),
  processedIdx: index("webhook_processed_idx").on(table.processed),
  providerIdx: index("webhook_provider_idx").on(table.provider),
}));

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;

// ============= API KEY VAULT TABLES =============

export const userApiKeys = mysqlTable("userApiKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  service: varchar("service", { length: 100 }).notNull(),
  keyName: varchar("keyName", { length: 255 }).notNull(),
  encryptedKey: text("encryptedKey").notNull(),
  iv: varchar("iv", { length: 32 }).notNull(), // Initialization vector for AES-256
  active: boolean("active").default(true).notNull(),
  lastUsed: timestamp("lastUsed"),
  expiresAt: timestamp("expiresAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("apikey_userId_idx").on(table.userId),
  serviceIdx: index("apikey_service_idx").on(table.service),
  userServiceUnique: unique("apikey_user_service_unique").on(table.userId, table.service, table.keyName),
  // Composite index for querying active keys by user and service
  userServiceActiveIdx: index("apikey_userId_service_active_idx").on(table.userId, table.service, table.active),
}));

export type UserApiKey = typeof userApiKeys.$inferSelect;
export type InsertUserApiKey = typeof userApiKeys.$inferInsert;

// ============= AUDIT LOG TABLES =============

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }).notNull(),
  resourceId: int("resourceId"),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("audit_userId_idx").on(table.userId),
  actionIdx: index("audit_action_idx").on(table.action),
  createdAtIdx: index("audit_createdAt_idx").on(table.createdAt),
  // Composite index for pagination queries: get audit logs by user, sorted by time
  userCreatedAtIdx: index("audit_userId_createdAt_idx").on(table.userId, table.createdAt),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============= APP REGISTRY TABLES =============

export const appRegistry = mysqlTable("appRegistry", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 500 }),
  category: varchar("category", { length: 100 }),
  routes: json("routes"),
  requiredIntegrations: json("requiredIntegrations"),
  dashboardPath: varchar("dashboardPath", { length: 255 }),
  setupPath: varchar("setupPath", { length: 255 }),
  tutorialPath: varchar("tutorialPath", { length: 255 }),
  settingsPath: varchar("settingsPath", { length: 255 }),
  productId: int("productId"),
  status: mysqlEnum("status", ["active", "beta", "coming_soon", "deprecated"]).default("active").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index("appreg_slug_idx").on(table.slug),
  statusIdx: index("appreg_status_idx").on(table.status),
}));

export type AppRegistryEntry = typeof appRegistry.$inferSelect;
export type InsertAppRegistryEntry = typeof appRegistry.$inferInsert;

// ============= BOUGIE BOUTIQUE E-COMMERCE TABLES =============

export const boutiqueProducts = mysqlTable("boutiqueProducts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  basePrice: int("basePrice").notNull(), // in cents
  image: varchar("image", { length: 500 }),
  printfulProductId: varchar("printfulProductId", { length: 100 }),
  printfulSyncVariantId: varchar("printfulSyncVariantId", { length: 100 }),
  printFileUrl: varchar("printFileUrl", { length: 500 }),
  mockupUrl: varchar("mockupUrl", { length: 500 }),
  variants: json("variants"),
  tags: json("tags"),
  active: boolean("active").default(true).notNull(),
  sustainabilityImpact: json("sustainabilityImpact"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("boutique_product_category_idx").on(table.category),
  printfulProductIdIdx: index("boutique_product_printfulProductId_idx").on(table.printfulProductId),
}));

export type BoutiqueProduct = typeof boutiqueProducts.$inferSelect;
export type InsertBoutiqueProduct = typeof boutiqueProducts.$inferInsert;

export const boutiqueOrders = mysqlTable("boutiqueOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "canceled"]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(),
  tax: int("tax").default(0),
  shipping: int("shipping").default(0),
  total: int("total").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  paymentProvider: mysqlEnum("paymentProvider", ["stripe", "paypal"]).notNull(),
  paymentId: varchar("paymentId", { length: 255 }),
  printfulOrderId: varchar("printfulOrderId", { length: 100 }),
  shippingAddress: json("shippingAddress"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  trackingUrl: varchar("trackingUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("boutique_order_userId_idx").on(table.userId),
  orderNumberIdx: index("boutique_order_orderNumber_idx").on(table.orderNumber),
  statusIdx: index("boutique_order_status_idx").on(table.status),
}));

export type BoutiqueOrder = typeof boutiqueOrders.$inferSelect;
export type InsertBoutiqueOrder = typeof boutiqueOrders.$inferInsert;

export const boutiqueOrderItems = mysqlTable("boutiqueOrderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  variantId: varchar("variantId", { length: 100 }),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(),
  totalPrice: int("totalPrice").notNull(),
  printfulItemId: varchar("printfulItemId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index("boutique_orderitem_orderId_idx").on(table.orderId),
  productIdIdx: index("boutique_orderitem_productId_idx").on(table.productId),
}));

export type BoutiqueOrderItem = typeof boutiqueOrderItems.$inferSelect;
export type InsertBoutiqueOrderItem = typeof boutiqueOrderItems.$inferInsert;

export const boutiqueCart = mysqlTable("boutiqueCart", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  variantId: varchar("variantId", { length: 100 }),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("boutique_cart_userId_idx").on(table.userId),
  userProductUnique: unique("boutique_cart_user_product_unique").on(table.userId, table.productId, table.variantId),
}));

export type BoutiqueCartItem = typeof boutiqueCart.$inferSelect;
export type InsertBoutiqueCartItem = typeof boutiqueCart.$inferInsert;

// ============= SIGMA STRENGTH CO. E-COMMERCE TABLES =============

export const sigmaProducts = mysqlTable("sigmaProducts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  basePrice: int("basePrice").notNull(), // in cents
  image: varchar("image", { length: 500 }),
  printfulProductId: varchar("printfulProductId", { length: 100 }),
  printfulSyncVariantId: varchar("printfulSyncVariantId", { length: 100 }),
  printFileUrl: varchar("printFileUrl", { length: 500 }),
  mockupUrl: varchar("mockupUrl", { length: 500 }),
  variants: json("variants"),
  tags: json("tags"),
  active: boolean("active").default(true).notNull(),
  mentalHealthFocus: varchar("mentalHealthFocus", { length: 255 }), // e.g., "anxiety", "depression", "self-worth"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("sigma_product_category_idx").on(table.category),
  printfulProductIdIdx: index("sigma_product_printfulProductId_idx").on(table.printfulProductId),
}));

export type SigmaProduct = typeof sigmaProducts.$inferSelect;
export type InsertSigmaProduct = typeof sigmaProducts.$inferInsert;

export const sigmaOrders = mysqlTable("sigmaOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "canceled"]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(),
  tax: int("tax").default(0),
  shipping: int("shipping").default(0),
  total: int("total").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  paymentProvider: mysqlEnum("paymentProvider", ["stripe", "paypal"]).notNull(),
  paymentId: varchar("paymentId", { length: 255 }),
  printfulOrderId: varchar("printfulOrderId", { length: 100 }),
  shippingAddress: json("shippingAddress"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  trackingUrl: varchar("trackingUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("sigma_order_userId_idx").on(table.userId),
  orderNumberIdx: index("sigma_order_orderNumber_idx").on(table.orderNumber),
  statusIdx: index("sigma_order_status_idx").on(table.status),
}));

export type SigmaOrder = typeof sigmaOrders.$inferSelect;
export type InsertSigmaOrder = typeof sigmaOrders.$inferInsert;

export const sigmaOrderItems = mysqlTable("sigmaOrderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  variantId: varchar("variantId", { length: 100 }),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(),
  totalPrice: int("totalPrice").notNull(),
  printfulItemId: varchar("printfulItemId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index("sigma_orderitem_orderId_idx").on(table.orderId),
  productIdIdx: index("sigma_orderitem_productId_idx").on(table.productId),
}));

export type SigmaOrderItem = typeof sigmaOrderItems.$inferSelect;
export type InsertSigmaOrderItem = typeof sigmaOrderItems.$inferInsert;

export const sigmaCart = mysqlTable("sigmaCart", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  variantId: varchar("variantId", { length: 100 }),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("sigma_cart_userId_idx").on(table.userId),
  userProductUnique: unique("sigma_cart_user_product_unique").on(table.userId, table.productId, table.variantId),
}));

export type SigmaCartItem = typeof sigmaCart.$inferSelect;
export type InsertSigmaCartItem = typeof sigmaCart.$inferInsert;

// ============= YOUTUBE AUTOMATION TABLES =============

export const youtubeChannels = mysqlTable("youtubeChannels", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  channelId: varchar("channelId", { length: 100 }).notNull(),
  channelName: varchar("channelName", { length: 255 }),
  apiKey: text("apiKey"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("youtube_channel_userId_idx").on(table.userId),
  channelIdIdx: index("youtube_channel_channelId_idx").on(table.channelId),
}));

export type YoutubeChannel = typeof youtubeChannels.$inferSelect;
export type InsertYoutubeChannel = typeof youtubeChannels.$inferInsert;

export const youtubeVideos = mysqlTable("youtubeVideos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  channelId: int("channelId").notNull(),
  videoId: varchar("videoId", { length: 100 }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "scheduled", "published", "failed"]).default("draft").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  publishedAt: timestamp("publishedAt"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  videoUrl: varchar("videoUrl", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("youtube_video_userId_idx").on(table.userId),
  channelIdIdx: index("youtube_video_channelId_idx").on(table.channelId),
  statusIdx: index("youtube_video_status_idx").on(table.status),
}));

export type YoutubeVideo = typeof youtubeVideos.$inferSelect;
export type InsertYoutubeVideo = typeof youtubeVideos.$inferInsert;

export const youtubeAnalytics = mysqlTable("youtubeAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(),
  views: int("views").default(0),
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  watchTime: int("watchTime").default(0), // in seconds
  ctr: decimal("ctr", { precision: 5, scale: 2 }).default("0.00"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  videoIdIdx: index("youtube_analytics_videoId_idx").on(table.videoId),
  dateIdx: index("youtube_analytics_date_idx").on(table.date),
}));

export type YoutubeAnalytics = typeof youtubeAnalytics.$inferSelect;
export type InsertYoutubeAnalytics = typeof youtubeAnalytics.$inferInsert;

// ============= SOCIAL MEDIA AUTOPILOT TABLES =============

export const videoDrafts = mysqlTable("videoDrafts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  videoUrl: varchar("videoUrl", { length: 500 }),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "scheduled", "posted"]).default("pending").notNull(),
  platforms: json("platforms"), // ["facebook", "youtube", "tiktok", "instagram", "snapchat"]
  trendSource: varchar("trendSource", { length: 255 }),
  affiliateOfferId: int("affiliateOfferId"),
  approvedAt: timestamp("approvedAt"),
  rejectedAt: timestamp("rejectedAt"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("video_draft_userId_idx").on(table.userId),
  statusIdx: index("video_draft_status_idx").on(table.status),
}));

export type VideoDraft = typeof videoDrafts.$inferSelect;
export type InsertVideoDraft = typeof videoDrafts.$inferInsert;

export const postPlans = mysqlTable("postPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  videoDraftId: int("videoDraftId").notNull(),
  platform: mysqlEnum("platform", ["facebook", "youtube", "tiktok", "instagram", "snapchat"]).notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  status: mysqlEnum("status", ["scheduled", "posting", "posted", "failed"]).default("scheduled").notNull(),
  postId: varchar("postId", { length: 255 }),
  postUrl: varchar("postUrl", { length: 500 }),
  error: text("error"),
  postedAt: timestamp("postedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("post_plan_userId_idx").on(table.userId),
  videoDraftIdIdx: index("post_plan_videoDraftId_idx").on(table.videoDraftId),
  statusIdx: index("post_plan_status_idx").on(table.status),
  scheduledForIdx: index("post_plan_scheduledFor_idx").on(table.scheduledFor),
}));

export type PostPlan = typeof postPlans.$inferSelect;
export type InsertPostPlan = typeof postPlans.$inferInsert;

export const trendItems = mysqlTable("trendItems", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  score: int("score").default(0),
  scannedAt: timestamp("scannedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index("trend_source_idx").on(table.source),
  scannedAtIdx: index("trend_scannedAt_idx").on(table.scannedAt),
}));

export type TrendItem = typeof trendItems.$inferSelect;
export type InsertTrendItem = typeof trendItems.$inferInsert;

export const affiliateOffers = mysqlTable("affiliateOffers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  affiliateLink: varchar("affiliateLink", { length: 500 }).notNull(),
  commission: decimal("commission", { precision: 5, scale: 2 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("affiliate_userId_idx").on(table.userId),
}));

export type AffiliateOffer = typeof affiliateOffers.$inferSelect;
export type InsertAffiliateOffer = typeof affiliateOffers.$inferInsert;

export const platformCredentials = mysqlTable("platformCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["facebook", "youtube", "tiktok", "instagram", "snapchat"]).notNull(),
  encryptedToken: text("encryptedToken").notNull(),
  iv: varchar("iv", { length: 32 }).notNull(),
  active: boolean("active").default(true).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("platform_cred_userId_idx").on(table.userId),
  userPlatformUnique: unique("platform_cred_user_platform_unique").on(table.userId, table.platform),
}));

export type PlatformCredential = typeof platformCredentials.$inferSelect;
export type InsertPlatformCredential = typeof platformCredentials.$inferInsert;

export const brandSettings = mysqlTable("brandSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  brandName: varchar("brandName", { length: 255 }),
  logoUrl: varchar("logoUrl", { length: 500 }),
  colorPrimary: varchar("colorPrimary", { length: 7 }),
  colorSecondary: varchar("colorSecondary", { length: 7 }),
  fontFamily: varchar("fontFamily", { length: 100 }),
  watermarkUrl: varchar("watermarkUrl", { length: 500 }),
  introClipUrl: varchar("introClipUrl", { length: 500 }),
  outroClipUrl: varchar("outroClipUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("brand_userId_idx").on(table.userId),
}));

export type BrandSettings = typeof brandSettings.$inferSelect;
export type InsertBrandSettings = typeof brandSettings.$inferInsert;

// ============= REFERRAL & REVIEW TABLES =============

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredEmail: varchar("referredEmail", { length: 320 }).notNull(),
  referredUserId: int("referredUserId"),
  status: mysqlEnum("status", ["pending", "registered", "converted", "rewarded"]).default("pending").notNull(),
  rewardType: mysqlEnum("rewardType", ["discount", "free_month", "credit"]),
  rewardAmount: int("rewardAmount"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  convertedAt: timestamp("convertedAt"),
}, (table) => ({
  referrerIdIdx: index("referral_referrerId_idx").on(table.referrerId),
  statusIdx: index("referral_status_idx").on(table.status),
}));

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(),
  content: text("content"),
  platform: mysqlEnum("platform", ["google", "internal", "trustpilot", "other"]).default("internal").notNull(),
  verified: boolean("verified").default(false),
  discountApplied: boolean("discountApplied").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("review_userId_idx").on(table.userId),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============= NOTIFICATION TABLES =============

export const emailNotifications = mysqlTable("emailNotifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  templateType: mysqlEnum("templateType", ["welcome", "registration", "upgrade", "special", "reminder", "support", "order_confirmation"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed", "bounced"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("email_status_idx").on(table.status),
  createdAtIdx: index("email_createdAt_idx").on(table.createdAt),
}));

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

export const smsNotifications = mysqlTable("smsNotifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientPhone: varchar("recipientPhone", { length: 20 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }),
  message: text("message").notNull(),
  templateType: mysqlEnum("templateType", ["welcome", "upgrade", "special", "reminder", "appointment", "coupon"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed", "delivered"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("sms_status_idx").on(table.status),
  userIdIdx: index("sms_userId_idx").on(table.userId),
}));

export type SmsNotification = typeof smsNotifications.$inferSelect;
export type InsertSmsNotification = typeof smsNotifications.$inferInsert;


// ============= EMPLOYEE OS (HR SUITE) TABLES =============

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyId: int("companyId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  employeeId: varchar("employeeId", { length: 50 }),
  hireDate: timestamp("hireDate"),
  terminationDate: timestamp("terminationDate"),
  status: mysqlEnum("status", ["active", "on_leave", "terminated", "pending"]).default("active").notNull(),
  salary: int("salary"), // annual salary in cents
  payType: mysqlEnum("payType", ["hourly", "salary", "contract"]),
  manager: int("manager"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("employee_userId_idx").on(table.userId),
  statusIdx: index("employee_status_idx").on(table.status),
  emailIdx: index("employee_email_idx").on(table.email),
}));

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

export const jobPostings = mysqlTable("jobPostings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 255 }),
  employmentType: mysqlEnum("employmentType", ["full_time", "part_time", "contract", "internship"]).notNull(),
  description: text("description"),
  requirements: json("requirements"),
  salaryMin: int("salaryMin"),
  salaryMax: int("salaryMax"),
  status: mysqlEnum("status", ["draft", "active", "closed", "filled"]).default("draft").notNull(),
  postedDate: timestamp("postedDate"),
  closedDate: timestamp("closedDate"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("job_userId_idx").on(table.userId),
  statusIdx: index("job_status_idx").on(table.status),
}));

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

export const applicants = mysqlTable("applicants", {
  id: int("id").autoincrement().primaryKey(),
  jobPostingId: int("jobPostingId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  resumeUrl: varchar("resumeUrl", { length: 500 }),
  coverLetter: text("coverLetter"),
  status: mysqlEnum("status", ["new", "screening", "interview", "offer", "hired", "rejected"]).default("new").notNull(),
  aiScore: int("aiScore"), // 0-100 AI screening score
  notes: text("notes"),
  interviewDate: timestamp("interviewDate"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  jobPostingIdIdx: index("applicant_jobPostingId_idx").on(table.jobPostingId),
  statusIdx: index("applicant_status_idx").on(table.status),
  emailIdx: index("applicant_email_idx").on(table.email),
}));

export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = typeof applicants.$inferInsert;

export const timeTracking = mysqlTable("timeTracking", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  clockIn: timestamp("clockIn").notNull(),
  clockOut: timestamp("clockOut"),
  breakMinutes: int("breakMinutes").default(0),
  totalHours: decimal("totalHours", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["clocked_in", "clocked_out", "approved", "disputed"]).default("clocked_in").notNull(),
  notes: text("notes"),
  approvedBy: int("approvedBy"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  employeeIdIdx: index("time_employeeId_idx").on(table.employeeId),
  clockInIdx: index("time_clockIn_idx").on(table.clockIn),
}));

export type TimeTracking = typeof timeTracking.$inferSelect;
export type InsertTimeTracking = typeof timeTracking.$inferInsert;

export const ptoRequests = mysqlTable("ptoRequests", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  requestType: mysqlEnum("requestType", ["vacation", "sick", "personal", "bereavement", "unpaid"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  totalDays: decimal("totalDays", { precision: 4, scale: 1 }).notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "approved", "denied", "canceled"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  reviewNotes: text("reviewNotes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  employeeIdIdx: index("pto_employeeId_idx").on(table.employeeId),
  statusIdx: index("pto_status_idx").on(table.status),
}));

export type PtoRequest = typeof ptoRequests.$inferSelect;
export type InsertPtoRequest = typeof ptoRequests.$inferInsert;

export const performanceReviews = mysqlTable("performanceReviews", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  reviewPeriodStart: timestamp("reviewPeriodStart").notNull(),
  reviewPeriodEnd: timestamp("reviewPeriodEnd").notNull(),
  overallRating: int("overallRating"), // 1-5 scale
  strengths: text("strengths"),
  areasForImprovement: text("areasForImprovement"),
  goals: json("goals"),
  feedback360: json("feedback360"),
  status: mysqlEnum("status", ["draft", "submitted", "acknowledged", "completed"]).default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  acknowledgedAt: timestamp("acknowledgedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  employeeIdIdx: index("review_employeeId_idx").on(table.employeeId),
  reviewerIdIdx: index("review_reviewerId_idx").on(table.reviewerId),
  statusIdx: index("review_status_idx").on(table.status),
}));

export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type InsertPerformanceReview = typeof performanceReviews.$inferInsert;

export const payrollRecords = mysqlTable("payrollRecords", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  payPeriodStart: timestamp("payPeriodStart").notNull(),
  payPeriodEnd: timestamp("payPeriodEnd").notNull(),
  grossPay: int("grossPay").notNull(), // in cents
  netPay: int("netPay").notNull(), // in cents
  federalTax: int("federalTax"),
  stateTax: int("stateTax"),
  socialSecurity: int("socialSecurity"),
  medicare: int("medicare"),
  deductions: json("deductions"),
  bonuses: int("bonuses"),
  overtime: int("overtime"),
  status: mysqlEnum("status", ["pending", "processed", "paid", "error"]).default("pending").notNull(),
  paidDate: timestamp("paidDate"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  employeeIdIdx: index("payroll_employeeId_idx").on(table.employeeId),
  statusIdx: index("payroll_status_idx").on(table.status),
  payPeriodEndIdx: index("payroll_payPeriodEnd_idx").on(table.payPeriodEnd),
}));

export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;


// ============= LLC FORMATION WIZARD TABLES =============

export const llcFormations = mysqlTable("llcFormations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(), // US state code
  businessType: varchar("businessType", { length: 100 }),
  businessPurpose: text("businessPurpose"),
  registeredAgent: json("registeredAgent"),
  members: json("members"),
  managementStructure: mysqlEnum("managementStructure", ["member_managed", "manager_managed"]),
  filingFee: int("filingFee"), // in cents
  status: mysqlEnum("status", ["draft", "in_progress", "filed", "approved", "rejected"]).default("draft").notNull(),
  filedDate: timestamp("filedDate"),
  approvedDate: timestamp("approvedDate"),
  ein: varchar("ein", { length: 20 }), // Employer Identification Number
  documents: json("documents"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("llc_userId_idx").on(table.userId),
  statusIdx: index("llc_status_idx").on(table.status),
  stateIdx: index("llc_state_idx").on(table.state),
}));

export type LlcFormation = typeof llcFormations.$inferSelect;
export type InsertLlcFormation = typeof llcFormations.$inferInsert;

export const llcDocuments = mysqlTable("llcDocuments", {
  id: int("id").autoincrement().primaryKey(),
  llcFormationId: int("llcFormationId").notNull(),
  documentType: mysqlEnum("documentType", ["articles_of_organization", "operating_agreement", "ein_confirmation", "certificate", "amendment", "other"]).notNull(),
  documentName: varchar("documentName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }),
  fileKey: varchar("fileKey", { length: 500 }),
  generatedContent: text("generatedContent"),
  status: mysqlEnum("status", ["draft", "generated", "signed", "filed"]).default("draft").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  llcFormationIdIdx: index("llcDoc_llcFormationId_idx").on(table.llcFormationId),
  documentTypeIdx: index("llcDoc_documentType_idx").on(table.documentType),
}));

export type LlcDocument = typeof llcDocuments.$inferSelect;
export type InsertLlcDocument = typeof llcDocuments.$inferInsert;

export const stateRequirements = mysqlTable("stateRequirements", {
  id: int("id").autoincrement().primaryKey(),
  state: varchar("state", { length: 2 }).notNull().unique(), // US state code
  stateName: varchar("stateName", { length: 100 }).notNull(),
  filingFee: int("filingFee").notNull(), // in cents
  processingTime: varchar("processingTime", { length: 100 }),
  annualReportRequired: boolean("annualReportRequired").default(false),
  annualReportFee: int("annualReportFee"),
  publicationRequired: boolean("publicationRequired").default(false),
  registeredAgentRequired: boolean("registeredAgentRequired").default(true),
  requirements: json("requirements"),
  filingUrl: varchar("filingUrl", { length: 500 }),
  contactInfo: json("contactInfo"),
  metadata: json("metadata"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  stateIdx: index("stateReq_state_idx").on(table.state),
}));

export type StateRequirement = typeof stateRequirements.$inferSelect;
export type InsertStateRequirement = typeof stateRequirements.$inferInsert;

// ============= DYNASTY TRUST WORKBOOK TABLES =============

export const trustWorkbooks = mysqlTable("trustWorkbooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  trustName: varchar("trustName", { length: 255 }).notNull(),
  trustType: mysqlEnum("trustType", ["dynasty", "irrevocable", "revocable", "ilit"]).default("dynasty").notNull(),
  jurisdiction: mysqlEnum("jurisdiction", ["south_dakota", "nevada", "delaware", "other"]),
  grantorInfo: json("grantorInfo"),
  trusteeInfo: json("trusteeInfo"),
  trustProtector: json("trustProtector"),
  beneficiaries: json("beneficiaries"),
  assetProtectionGoals: text("assetProtectionGoals"),
  taxConsiderations: json("taxConsiderations"),
  distributionRules: json("distributionRules"),
  estimatedAssetValue: int("estimatedAssetValue"), // in cents
  status: mysqlEnum("status", ["draft", "in_review", "attorney_review", "completed"]).default("draft").notNull(),
  completedAt: timestamp("completedAt"),
  attorneyNotes: text("attorneyNotes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("trust_userId_idx").on(table.userId),
  statusIdx: index("trust_status_idx").on(table.status),
  jurisdictionIdx: index("trust_jurisdiction_idx").on(table.jurisdiction),
}));

export type TrustWorkbook = typeof trustWorkbooks.$inferSelect;
export type InsertTrustWorkbook = typeof trustWorkbooks.$inferInsert;

export const trustBeneficiaries = mysqlTable("trustBeneficiaries", {
  id: int("id").autoincrement().primaryKey(),
  trustWorkbookId: int("trustWorkbookId").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  dateOfBirth: timestamp("dateOfBirth"),
  ssn: varchar("ssn", { length: 20 }), // Encrypted in production
  beneficiaryType: mysqlEnum("beneficiaryType", ["primary", "contingent", "remainder"]).notNull(),
  distributionPercentage: int("distributionPercentage"), // 0-100
  distributionConditions: text("distributionConditions"),
  specialNeeds: text("specialNeeds"),
  contactInfo: json("contactInfo"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  trustWorkbookIdIdx: index("beneficiary_trustWorkbookId_idx").on(table.trustWorkbookId),
  beneficiaryTypeIdx: index("beneficiary_type_idx").on(table.beneficiaryType),
}));

export type TrustBeneficiary = typeof trustBeneficiaries.$inferSelect;
export type InsertTrustBeneficiary = typeof trustBeneficiaries.$inferInsert;

export const trustJurisdictions = mysqlTable("trustJurisdictions", {
  id: int("id").autoincrement().primaryKey(),
  jurisdiction: varchar("jurisdiction", { length: 100 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  perpetualDuration: boolean("perpetualDuration").default(false),
  directedTrustsAllowed: boolean("directedTrustsAllowed").default(false),
  decantingStatute: boolean("decantingStatute").default(false),
  stateIncomeTax: boolean("stateIncomeTax").default(true),
  capitalGainsTax: boolean("capitalGainsTax").default(true),
  estateTax: boolean("estateTax").default(true),
  assetProtectionStrength: mysqlEnum("assetProtectionStrength", ["excellent", "good", "moderate", "limited"]),
  privacyProtections: mysqlEnum("privacyProtections", ["strong", "moderate", "limited"]),
  advantages: json("advantages"),
  disadvantages: json("disadvantages"),
  estimatedSetupCost: int("estimatedSetupCost"), // in cents
  annualMaintenanceCost: int("annualMaintenanceCost"), // in cents
  metadata: json("metadata"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  jurisdictionIdx: index("jurisdiction_idx").on(table.jurisdiction),
}));

export type TrustJurisdiction = typeof trustJurisdictions.$inferSelect;
export type InsertTrustJurisdiction = typeof trustJurisdictions.$inferInsert;


// ============= CRM & SALES TABLES =============

export const crmContacts = mysqlTable("crmContacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  companyId: int("companyId"),
  title: varchar("title", { length: 100 }),
  leadScore: int("leadScore"), // 0-100 AI lead scoring
  status: mysqlEnum("status", ["lead", "prospect", "customer", "inactive"]).default("lead").notNull(),
  source: varchar("source", { length: 100 }),
  tags: json("tags"),
  customFields: json("customFields"),
  lastContactedAt: timestamp("lastContactedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("contact_userId_idx").on(table.userId),
  emailIdx: index("contact_email_idx").on(table.email),
  statusIdx: index("contact_status_idx").on(table.status),
}));

export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = typeof crmContacts.$inferInsert;

export const crmCompanies = mysqlTable("crmCompanies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  website: varchar("website", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  size: varchar("size", { length: 50 }),
  revenue: int("revenue"), // annual revenue in cents
  address: json("address"),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["active", "inactive", "prospect"]).default("active").notNull(),
  tags: json("tags"),
  customFields: json("customFields"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("company_userId_idx").on(table.userId),
  nameIdx: index("company_name_idx").on(table.name),
}));

export type CrmCompany = typeof crmCompanies.$inferSelect;
export type InsertCrmCompany = typeof crmCompanies.$inferInsert;

export const crmDeals = mysqlTable("crmDeals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  companyId: int("companyId"),
  title: varchar("title", { length: 255 }).notNull(),
  value: int("value").notNull(), // deal value in cents
  stage: mysqlEnum("stage", ["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).notNull(),
  probability: int("probability"), // 0-100
  expectedCloseDate: timestamp("expectedCloseDate"),
  actualCloseDate: timestamp("actualCloseDate"),
  lostReason: text("lostReason"),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("deal_userId_idx").on(table.userId),
  stageIdx: index("deal_stage_idx").on(table.stage),
  contactIdIdx: index("deal_contactId_idx").on(table.contactId),
}));

export type CrmDeal = typeof crmDeals.$inferSelect;
export type InsertCrmDeal = typeof crmDeals.$inferInsert;

export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dealId: int("dealId"),
  contactId: int("contactId"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  totalAmount: int("totalAmount").notNull(), // in cents
  lineItems: json("lineItems"),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "accepted", "rejected", "expired"]).default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  viewedAt: timestamp("viewedAt"),
  respondedAt: timestamp("respondedAt"),
  expiresAt: timestamp("expiresAt"),
  signatureUrl: varchar("signatureUrl", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("proposal_userId_idx").on(table.userId),
  statusIdx: index("proposal_status_idx").on(table.status),
  dealIdIdx: index("proposal_dealId_idx").on(table.dealId),
}));

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

// ============= FINANCE SUITE TABLES =============

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  issueDate: timestamp("issueDate").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  tax: int("tax").default(0),
  total: int("total").notNull(), // in cents
  amountPaid: int("amountPaid").default(0),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "partial", "paid", "overdue", "canceled"]).default("draft").notNull(),
  lineItems: json("lineItems"),
  notes: text("notes"),
  paymentTerms: varchar("paymentTerms", { length: 255 }),
  recurring: boolean("recurring").default(false),
  recurringInterval: mysqlEnum("recurringInterval", ["weekly", "monthly", "quarterly", "yearly"]),
  paidAt: timestamp("paidAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("invoice_userId_idx").on(table.userId),
  statusIdx: index("invoice_status_idx").on(table.status),
  invoiceNumberIdx: index("invoice_invoiceNumber_idx").on(table.invoiceNumber),
}));

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD"),
  date: timestamp("date").notNull(),
  merchant: varchar("merchant", { length: 255 }),
  description: text("description"),
  receiptUrl: varchar("receiptUrl", { length: 500 }),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "reimbursed"]).default("pending").notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  reimbursedAt: timestamp("reimbursedAt"),
  tags: json("tags"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("expense_userId_idx").on(table.userId),
  categoryIdx: index("expense_category_idx").on(table.category),
  statusIdx: index("expense_status_idx").on(table.status),
  dateIdx: index("expense_date_idx").on(table.date),
}));

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

export const financialReports = mysqlTable("financialReports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reportType: mysqlEnum("reportType", ["profit_loss", "cash_flow", "balance_sheet", "forecast", "budget_vs_actual"]).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  data: json("data").notNull(),
  summary: json("summary"),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  metadata: json("metadata"),
}, (table) => ({
  userIdIdx: index("report_userId_idx").on(table.userId),
  reportTypeIdx: index("report_reportType_idx").on(table.reportType),
  periodEndIdx: index("report_periodEnd_idx").on(table.periodEnd),
}));

export type FinancialReport = typeof financialReports.$inferSelect;
export type InsertFinancialReport = typeof financialReports.$inferInsert;

// ============= OPERATIONS SUITE TABLES =============

export const inventoryItems = mysqlTable("inventoryItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  quantity: int("quantity").default(0).notNull(),
  reorderPoint: int("reorderPoint").default(0),
  reorderQuantity: int("reorderQuantity").default(0),
  unitCost: int("unitCost"), // in cents
  unitPrice: int("unitPrice"), // in cents
  location: varchar("location", { length: 255 }),
  barcode: varchar("barcode", { length: 100 }),
  supplier: varchar("supplier", { length: 255 }),
  status: mysqlEnum("status", ["in_stock", "low_stock", "out_of_stock", "discontinued"]).default("in_stock").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("inventory_userId_idx").on(table.userId),
  skuIdx: index("inventory_sku_idx").on(table.sku),
  statusIdx: index("inventory_status_idx").on(table.status),
}));

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  contactId: int("contactId"),
  orderType: mysqlEnum("orderType", ["sale", "purchase", "return", "exchange"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "canceled", "refunded"]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  tax: int("tax").default(0),
  shipping: int("shipping").default(0),
  total: int("total").notNull(), // in cents
  items: json("items"),
  shippingAddress: json("shippingAddress"),
  billingAddress: json("billingAddress"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  carrier: varchar("carrier", { length: 100 }),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("order_userId_idx").on(table.userId),
  orderNumberIdx: index("order_orderNumber_idx").on(table.orderNumber),
  statusIdx: index("order_status_idx").on(table.status),
}));

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  address: json("address"),
  paymentTerms: varchar("paymentTerms", { length: 255 }),
  taxId: varchar("taxId", { length: 50 }),
  status: mysqlEnum("status", ["active", "inactive", "blocked"]).default("active").notNull(),
  performanceRating: int("performanceRating"), // 1-5 scale
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("vendor_userId_idx").on(table.userId),
  nameIdx: index("vendor_name_idx").on(table.name),
  statusIdx: index("vendor_status_idx").on(table.status),
}));

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

// ============= LEGAL SERVICES TABLES =============

export const creditDisputes = mysqlTable("creditDisputes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bureau: mysqlEnum("bureau", ["equifax", "experian", "transunion"]).notNull(),
  accountName: varchar("accountName", { length: 255 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 100 }),
  disputeReason: text("disputeReason").notNull(),
  letterContent: text("letterContent"),
  status: mysqlEnum("status", ["draft", "sent", "in_review", "resolved", "rejected"]).default("draft").notNull(),
  sentDate: timestamp("sentDate"),
  responseDate: timestamp("responseDate"),
  outcome: text("outcome"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("dispute_userId_idx").on(table.userId),
  bureauIdx: index("dispute_bureau_idx").on(table.bureau),
  statusIdx: index("dispute_status_idx").on(table.status),
}));

export type CreditDispute = typeof creditDisputes.$inferSelect;
export type InsertCreditDispute = typeof creditDisputes.$inferInsert;

export const brunnerTests = mysqlTable("brunnerTests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  loanType: varchar("loanType", { length: 100 }).notNull(),
  loanAmount: int("loanAmount").notNull(), // in cents
  monthlyPayment: int("monthlyPayment").notNull(), // in cents
  monthlyIncome: int("monthlyIncome").notNull(), // in cents
  monthlyExpenses: int("monthlyExpenses").notNull(), // in cents
  dependents: int("dependents").default(0),
  employmentStatus: varchar("employmentStatus", { length: 100 }),
  medicalConditions: text("medicalConditions"),
  goodFaithEfforts: text("goodFaithEfforts"),
  prongOneScore: int("prongOneScore"), // 0-100
  prongTwoScore: int("prongTwoScore"), // 0-100
  prongThreeScore: int("prongThreeScore"), // 0-100
  overallScore: int("overallScore"), // 0-100
  likelihood: mysqlEnum("likelihood", ["very_low", "low", "moderate", "high", "very_high"]),
  recommendations: text("recommendations"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("brunner_userId_idx").on(table.userId),
  overallScoreIdx: index("brunner_overallScore_idx").on(table.overallScore),
}));

export type BrunnerTest = typeof brunnerTests.$inferSelect;
export type InsertBrunnerTest = typeof brunnerTests.$inferInsert;

export const professionalDirectory = mysqlTable("professionalDirectory", {
  id: int("id").autoincrement().primaryKey(),
  professionalType: mysqlEnum("professionalType", ["attorney", "cpa"]).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  firmName: varchar("firmName", { length: 255 }),
  state: varchar("state", { length: 2 }).notNull(), // US state code
  licenseNumber: varchar("licenseNumber", { length: 100 }),
  specialties: json("specialties"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  address: json("address"),
  barVerificationUrl: varchar("barVerificationUrl", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // 0.00-5.00
  reviewCount: int("reviewCount").default(0),
  freeConsultation: boolean("freeConsultation").default(false),
  verified: boolean("verified").default(false),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  professionalTypeIdx: index("prof_professionalType_idx").on(table.professionalType),
  stateIdx: index("prof_state_idx").on(table.state),
  verifiedIdx: index("prof_verified_idx").on(table.verified),
}));

export type ProfessionalDirectoryEntry = typeof professionalDirectory.$inferSelect;
export type InsertProfessionalDirectoryEntry = typeof professionalDirectory.$inferInsert;

// ============= WORKFLOWS BUILDER TABLES =============

export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  triggerType: mysqlEnum("triggerType", ["time_based", "event_based", "webhook", "manual"]).notNull(),
  triggerConfig: json("triggerConfig"),
  status: mysqlEnum("status", ["active", "inactive", "draft"]).default("draft").notNull(),
  executionCount: int("executionCount").default(0),
  lastExecutedAt: timestamp("lastExecutedAt"),
  errorCount: int("errorCount").default(0),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("workflow_userId_idx").on(table.userId),
  statusIdx: index("workflow_status_idx").on(table.status),
}));

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

export const workflowSteps = mysqlTable("workflowSteps", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  stepOrder: int("stepOrder").notNull(),
  stepType: mysqlEnum("stepType", ["action", "condition", "approval", "delay"]).notNull(),
  actionType: varchar("actionType", { length: 100 }), // email, sms, api_call, database_update
  config: json("config"),
  conditions: json("conditions"),
  approvalRequired: boolean("approvalRequired").default(false),
  approverUserId: int("approverUserId"),
  retryOnFailure: boolean("retryOnFailure").default(false),
  maxRetries: int("maxRetries").default(3),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  workflowIdIdx: index("step_workflowId_idx").on(table.workflowId),
  stepOrderIdx: index("step_stepOrder_idx").on(table.stepOrder),
}));

export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = typeof workflowSteps.$inferInsert;

export const workflowExecutions = mysqlTable("workflowExecutions", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  status: mysqlEnum("status", ["running", "completed", "failed", "canceled"]).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  triggerData: json("triggerData"),
  stepResults: json("stepResults"),
  errorMessage: text("errorMessage"),
  metadata: json("metadata"),
}, (table) => ({
  workflowIdIdx: index("execution_workflowId_idx").on(table.workflowId),
  statusIdx: index("execution_status_idx").on(table.status),
  startedAtIdx: index("execution_startedAt_idx").on(table.startedAt),
}));

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = typeof workflowExecutions.$inferInsert;


// ============= WHERE'S MY TRIBE TABLES =============

export const tribeMembers = mysqlTable("tribeMembers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 500 }),
  location: varchar("location", { length: 255 }),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  interests: json("interests"), // Array of interest tags
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  ratingCount: int("ratingCount").default(0),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  lastActive: timestamp("lastActive"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("tribeMember_userId_idx").on(table.userId),
  locationIdx: index("tribeMember_location_idx").on(table.location),
  statusIdx: index("tribeMember_status_idx").on(table.status),
}));

export type TribeMember = typeof tribeMembers.$inferSelect;
export type InsertTribeMember = typeof tribeMembers.$inferInsert;

export const tribeEvents = mysqlTable("tribeEvents", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: mysqlEnum("eventType", ["bucket_list", "game_night", "social", "adventure", "meetup", "workshop"]).notNull(),
  location: varchar("location", { length: 255 }),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  isRevealed: boolean("isRevealed").default(false), // Location revealed after joining
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  maxAttendees: int("maxAttendees"),
  currentAttendees: int("currentAttendees").default(0),
  status: mysqlEnum("status", ["draft", "published", "in_progress", "completed", "canceled"]).default("draft").notNull(),
  tags: json("tags"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  creatorIdIdx: index("tribeEvent_creatorId_idx").on(table.creatorId),
  statusIdx: index("tribeEvent_status_idx").on(table.status),
  startTimeIdx: index("tribeEvent_startTime_idx").on(table.startTime),
  eventTypeIdx: index("tribeEvent_eventType_idx").on(table.eventType),
}));

export type TribeEvent = typeof tribeEvents.$inferSelect;
export type InsertTribeEvent = typeof tribeEvents.$inferInsert;

export const tribeEventAttendees = mysqlTable("tribeEventAttendees", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  memberId: int("memberId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "declined", "attended"]).default("confirmed").notNull(),
  rsvpDate: timestamp("rsvpDate").defaultNow().notNull(),
  metadata: json("metadata"),
}, (table) => ({
  eventIdIdx: index("attendee_eventId_idx").on(table.eventId),
  memberIdIdx: index("attendee_memberId_idx").on(table.memberId),
  statusIdx: index("attendee_status_idx").on(table.status),
}));

export type TribeEventAttendee = typeof tribeEventAttendees.$inferSelect;
export type InsertTribeEventAttendee = typeof tribeEventAttendees.$inferInsert;

export const tribeMessages = mysqlTable("tribeMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId"), // Null for group messages
  eventId: int("eventId"), // If message is in event chat
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "location", "system"]).default("text").notNull(),
  isRead: boolean("isRead").default(false),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  senderIdIdx: index("message_senderId_idx").on(table.senderId),
  recipientIdIdx: index("message_recipientId_idx").on(table.recipientId),
  eventIdIdx: index("message_eventId_idx").on(table.eventId),
  createdAtIdx: index("message_createdAt_idx").on(table.createdAt),
}));

export type TribeMessage = typeof tribeMessages.$inferSelect;
export type InsertTribeMessage = typeof tribeMessages.$inferInsert;

export const tribeMemberRatings = mysqlTable("tribeMemberRatings", {
  id: int("id").autoincrement().primaryKey(),
  raterId: int("raterId").notNull(),
  ratedMemberId: int("ratedMemberId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  review: text("review"),
  eventId: int("eventId"), // Optional: rating from specific event
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  raterIdIdx: index("rating_raterId_idx").on(table.raterId),
  ratedMemberIdIdx: index("rating_ratedMemberId_idx").on(table.ratedMemberId),
  eventIdIdx: index("rating_eventId_idx").on(table.eventId),
}));

export type TribeMemberRating = typeof tribeMemberRatings.$inferSelect;
export type InsertTribeMemberRating = typeof tribeMemberRatings.$inferInsert;

// ============= KAIDEN SYNC ONBOARDING TABLES =============

export const onboardingResponses = mysqlTable("onboardingResponses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questionId: varchar("questionId", { length: 100 }).notNull(),
  questionText: text("questionText").notNull(),
  response: text("response").notNull(),
  responseType: mysqlEnum("responseType", ["text", "choice", "scale", "multiple"]).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("onboarding_userId_idx").on(table.userId),
  questionIdIdx: index("onboarding_questionId_idx").on(table.questionId),
}));

export type OnboardingResponse = typeof onboardingResponses.$inferSelect;
export type InsertOnboardingResponse = typeof onboardingResponses.$inferInsert;

export const personalityProfiles = mysqlTable("personalityProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  profileType: mysqlEnum("profileType", ["myers_briggs", "big_five", "disc", "enneagram", "custom"]).notNull(),
  primaryType: varchar("primaryType", { length: 50 }).notNull(), // e.g., "INTJ", "Enneagram 5"
  secondaryTraits: json("secondaryTraits"),
  strengths: json("strengths"),
  growthAreas: json("growthAreas"),
  workStyle: text("workStyle"),
  communicationPreferences: json("communicationPreferences"),
  stressManagement: text("stressManagement"),
  motivations: json("motivations"),
  idealEnvironment: text("idealEnvironment"),
  careerSuggestions: json("careerSuggestions"),
  relationshipInsights: text("relationshipInsights"),
  aiAnalysis: text("aiAnalysis"), // AI-generated personality insights
  completionPercentage: int("completionPercentage").default(0),
  status: mysqlEnum("status", ["incomplete", "completed", "needs_review"]).default("incomplete").notNull(),
  completedAt: timestamp("completedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("personality_userId_idx").on(table.userId),
  profileTypeIdx: index("personality_profileType_idx").on(table.profileType),
  statusIdx: index("personality_status_idx").on(table.status),
}));

export type PersonalityProfile = typeof personalityProfiles.$inferSelect;
export type InsertPersonalityProfile = typeof personalityProfiles.$inferInsert;

export const onboardingProgress = mysqlTable("onboardingProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStep: int("currentStep").default(1).notNull(),
  totalSteps: int("totalSteps").default(10).notNull(),
  completedSteps: json("completedSteps"), // Array of completed step IDs
  skippedSteps: json("skippedSteps"), // Array of skipped step IDs
  onboardingType: mysqlEnum("onboardingType", ["full", "quick", "custom"]).default("full").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("progress_userId_idx").on(table.userId),
  statusIdx: index("progress_status_idx").on(table.status),
}));

export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
export type InsertOnboardingProgress = typeof onboardingProgress.$inferInsert;

// ============= BUILDWEALTH PRO TABLES =============

export const wealthAccounts = mysqlTable("wealthAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountName: varchar("accountName", { length: 255 }).notNull(),
  accountType: mysqlEnum("accountType", ["brokerage", "retirement_401k", "retirement_ira", "roth_ira", "hsa", "real_estate", "crypto", "other"]).notNull(),
  institution: varchar("institution", { length: 255 }),
  accountNumber: varchar("accountNumber", { length: 100 }),
  currentBalance: int("currentBalance").notNull(), // in cents
  targetAllocation: json("targetAllocation"),
  status: mysqlEnum("status", ["active", "closed", "frozen"]).default("active").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("wealth_account_userId_idx").on(table.userId),
  statusIdx: index("wealth_account_status_idx").on(table.status),
}));

export type WealthAccount = typeof wealthAccounts.$inferSelect;
export type InsertWealthAccount = typeof wealthAccounts.$inferInsert;

export const wealthTransactions = mysqlTable("wealthTransactions", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  transactionType: mysqlEnum("transactionType", ["contribution", "withdrawal", "dividend", "interest", "capital_gain", "fee", "transfer"]).notNull(),
  amount: int("amount").notNull(), // in cents
  transactionDate: timestamp("transactionDate").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  ticker: varchar("ticker", { length: 20 }), // Stock/fund ticker symbol
  shares: decimal("shares", { precision: 18, scale: 8 }),
  pricePerShare: int("pricePerShare"), // in cents
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  accountIdIdx: index("wealth_transaction_accountId_idx").on(table.accountId),
  transactionDateIdx: index("wealth_transaction_date_idx").on(table.transactionDate),
}));

export type WealthTransaction = typeof wealthTransactions.$inferSelect;
export type InsertWealthTransaction = typeof wealthTransactions.$inferInsert;

export const wealthGoals = mysqlTable("wealthGoals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  goalName: varchar("goalName", { length: 255 }).notNull(),
  goalType: mysqlEnum("goalType", ["retirement", "home_purchase", "education", "emergency_fund", "other"]).notNull(),
  targetAmount: int("targetAmount").notNull(), // in cents
  currentAmount: int("currentAmount").default(0).notNull(), // in cents
  targetDate: timestamp("targetDate"),
  monthlyContribution: int("monthlyContribution"), // in cents
  description: text("description"),
  status: mysqlEnum("status", ["active", "completed", "paused", "abandoned"]).default("active").notNull(),
  progress: int("progress").default(0), // percentage 0-100
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("wealth_goal_userId_idx").on(table.userId),
  statusIdx: index("wealth_goal_status_idx").on(table.status),
  targetDateIdx: index("wealth_goal_targetDate_idx").on(table.targetDate),
}));

export type WealthGoal = typeof wealthGoals.$inferSelect;
export type InsertWealthGoal = typeof wealthGoals.$inferInsert;


// ============= SALES CRM TABLES =============

export const salesCrmContacts = mysqlTable("salesCrmContacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  title: varchar("title", { length: 100 }),
  source: varchar("source", { length: 100 }),
  status: mysqlEnum("status", ["lead", "prospect", "customer", "inactive"]).default("lead").notNull(),
  tags: json("tags"),
  notes: text("notes"),
  lastContactedAt: timestamp("lastContactedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("sales_crm_contact_userId_idx").on(table.userId),
  emailIdx: index("sales_crm_contact_email_idx").on(table.email),
  statusIdx: index("sales_crm_contact_status_idx").on(table.status),
}));

export type SalesCrmContact = typeof salesCrmContacts.$inferSelect;
export type InsertSalesCrmContact = typeof salesCrmContacts.$inferInsert;

export const salesCrmDeals = mysqlTable("salesCrmDeals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  title: varchar("title", { length: 255 }).notNull(),
  value: int("value").notNull(), // in cents
  stage: mysqlEnum("stage", ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"]).default("prospecting").notNull(),
  probability: int("probability").default(0), // 0-100
  expectedCloseDate: timestamp("expectedCloseDate"),
  actualCloseDate: timestamp("actualCloseDate"),
  description: text("description"),
  lostReason: text("lostReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("sales_crm_deal_userId_idx").on(table.userId),
  contactIdIdx: index("sales_crm_deal_contactId_idx").on(table.contactId),
  stageIdx: index("sales_crm_deal_stage_idx").on(table.stage),
}));

export type SalesCrmDeal = typeof salesCrmDeals.$inferSelect;
export type InsertSalesCrmDeal = typeof salesCrmDeals.$inferInsert;

export const salesCrmProposals = mysqlTable("salesCrmProposals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dealId: int("dealId"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  totalAmount: int("totalAmount").notNull(), // in cents
  status: mysqlEnum("status", ["draft", "sent", "viewed", "accepted", "rejected"]).default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  viewedAt: timestamp("viewedAt"),
  respondedAt: timestamp("respondedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("sales_crm_proposal_userId_idx").on(table.userId),
  dealIdIdx: index("sales_crm_proposal_dealId_idx").on(table.dealId),
  statusIdx: index("sales_crm_proposal_status_idx").on(table.status),
}));

export type SalesCrmProposal = typeof salesCrmProposals.$inferSelect;
export type InsertSalesCrmProposal = typeof salesCrmProposals.$inferInsert;


// ============= EMPLOYEE OS (HR SUITE) TABLES =============

export const employeeOsEmployees = mysqlTable("employeeOsEmployees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Company owner
  employeeId: varchar("employeeId", { length: 50 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  hireDate: timestamp("hireDate").notNull(),
  salary: int("salary"), // in cents, encrypted
  status: mysqlEnum("status", ["active", "on_leave", "terminated"]).default("active").notNull(),
  emergencyContact: json("emergencyContact"),
  documents: json("documents"), // Array of document URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("employee_os_employee_userId_idx").on(table.userId),
  employeeIdIdx: index("employee_os_employee_employeeId_idx").on(table.employeeId),
  statusIdx: index("employee_os_employee_status_idx").on(table.status),
}));

export type EmployeeOsEmployee = typeof employeeOsEmployees.$inferSelect;
export type InsertEmployeeOsEmployee = typeof employeeOsEmployees.$inferInsert;

export const employeeOsPerformanceReviews = mysqlTable("employeeOsPerformanceReviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeId: int("employeeId").notNull(),
  reviewDate: timestamp("reviewDate").notNull(),
  reviewPeriodStart: timestamp("reviewPeriodStart").notNull(),
  reviewPeriodEnd: timestamp("reviewPeriodEnd").notNull(),
  overallRating: int("overallRating").notNull(), // 1-5
  strengths: text("strengths"),
  areasForImprovement: text("areasForImprovement"),
  goals: json("goals"),
  reviewerNotes: text("reviewerNotes"),
  employeeComments: text("employeeComments"),
  status: mysqlEnum("status", ["draft", "completed", "acknowledged"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("employee_os_review_userId_idx").on(table.userId),
  employeeIdIdx: index("employee_os_review_employeeId_idx").on(table.employeeId),
  statusIdx: index("employee_os_review_status_idx").on(table.status),
}));

export type EmployeeOsPerformanceReview = typeof employeeOsPerformanceReviews.$inferSelect;
export type InsertEmployeeOsPerformanceReview = typeof employeeOsPerformanceReviews.$inferInsert;

export const employeeOsTimeTracking = mysqlTable("employeeOsTimeTracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeId: int("employeeId").notNull(),
  date: timestamp("date").notNull(),
  clockIn: timestamp("clockIn").notNull(),
  clockOut: timestamp("clockOut"),
  breakMinutes: int("breakMinutes").default(0),
  totalHours: decimal("totalHours", { precision: 5, scale: 2 }),
  overtimeHours: decimal("overtimeHours", { precision: 5, scale: 2 }).default("0"),
  notes: text("notes"),
  approved: boolean("approved").default(false),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("employee_os_time_userId_idx").on(table.userId),
  employeeIdIdx: index("employee_os_time_employeeId_idx").on(table.employeeId),
  dateIdx: index("employee_os_time_date_idx").on(table.date),
}));

export type EmployeeOsTimeTracking = typeof employeeOsTimeTracking.$inferSelect;
export type InsertEmployeeOsTimeTracking = typeof employeeOsTimeTracking.$inferInsert;

export const employeeOsPayroll = mysqlTable("employeeOsPayroll", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  employeeId: int("employeeId").notNull(),
  payPeriodStart: timestamp("payPeriodStart").notNull(),
  payPeriodEnd: timestamp("payPeriodEnd").notNull(),
  grossPay: int("grossPay").notNull(), // in cents
  deductions: json("deductions"), // {tax, insurance, etc}
  netPay: int("netPay").notNull(), // in cents
  paymentMethod: mysqlEnum("paymentMethod", ["direct_deposit", "check", "cash"]).notNull(),
  paymentDate: timestamp("paymentDate"),
  status: mysqlEnum("status", ["pending", "processed", "paid"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("employee_os_payroll_userId_idx").on(table.userId),
  employeeIdIdx: index("employee_os_payroll_employeeId_idx").on(table.employeeId),
  statusIdx: index("employee_os_payroll_status_idx").on(table.status),
}));

export type EmployeeOsPayroll = typeof employeeOsPayroll.$inferSelect;
export type InsertEmployeeOsPayroll = typeof employeeOsPayroll.$inferInsert;


// ============= INVOICE GENERATOR TABLES =============

export const invoiceGenClients = mysqlTable("invoiceGenClients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  address: text("address"),
  taxId: varchar("taxId", { length: 50 }),
  paymentTerms: int("paymentTerms").default(30), // days
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("invoice_gen_client_userId_idx").on(table.userId),
  emailIdx: index("invoice_gen_client_email_idx").on(table.email),
}));

export type InvoiceGenClient = typeof invoiceGenClients.$inferSelect;
export type InsertInvoiceGenClient = typeof invoiceGenClients.$inferInsert;

export const invoiceGenInvoices = mysqlTable("invoiceGenInvoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull(),
  issueDate: timestamp("issueDate").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("0"),
  taxAmount: int("taxAmount").default(0), // in cents
  total: int("total").notNull(), // in cents
  amountPaid: int("amountPaid").default(0), // in cents
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue", "cancelled"]).default("draft").notNull(),
  notes: text("notes"),
  terms: text("terms"),
  lineItems: json("lineItems").notNull(), // Array of {description, quantity, rate, amount}
  sentAt: timestamp("sentAt"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("invoice_gen_invoice_userId_idx").on(table.userId),
  clientIdIdx: index("invoice_gen_invoice_clientId_idx").on(table.clientId),
  statusIdx: index("invoice_gen_invoice_status_idx").on(table.status),
  invoiceNumberIdx: index("invoice_gen_invoice_number_idx").on(table.invoiceNumber),
}));

export type InvoiceGenInvoice = typeof invoiceGenInvoices.$inferSelect;
export type InsertInvoiceGenInvoice = typeof invoiceGenInvoices.$inferInsert;

export const invoiceGenPayments = mysqlTable("invoiceGenPayments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  invoiceId: int("invoiceId").notNull(),
  amount: int("amount").notNull(), // in cents
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentDate: timestamp("paymentDate").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("invoice_gen_payment_userId_idx").on(table.userId),
  invoiceIdIdx: index("invoice_gen_payment_invoiceId_idx").on(table.invoiceId),
}));

export type InvoiceGenPayment = typeof invoiceGenPayments.$inferSelect;
export type InsertInvoiceGenPayment = typeof invoiceGenPayments.$inferInsert;


// ============= EXPENSE TRACKER TABLES =============

export const expenseTrackerCategories = mysqlTable("expenseTrackerCategories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  budget: int("budget"), // monthly budget in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("expense_tracker_category_userId_idx").on(table.userId),
}));

export type ExpenseTrackerCategory = typeof expenseTrackerCategories.$inferSelect;
export type InsertExpenseTrackerCategory = typeof expenseTrackerCategories.$inferInsert;

export const expenseTrackerExpenses = mysqlTable("expenseTrackerExpenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  categoryId: int("categoryId").notNull(),
  amount: int("amount").notNull(), // in cents
  description: text("description"),
  date: timestamp("date").notNull(),
  receiptUrl: varchar("receiptUrl", { length: 500 }),
  merchant: varchar("merchant", { length: 255 }),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  tags: json("tags"), // Array of strings
  isRecurring: boolean("isRecurring").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("expense_tracker_expense_userId_idx").on(table.userId),
  categoryIdIdx: index("expense_tracker_expense_categoryId_idx").on(table.categoryId),
  dateIdx: index("expense_tracker_expense_date_idx").on(table.date),
}));

export type ExpenseTrackerExpense = typeof expenseTrackerExpenses.$inferSelect;
export type InsertExpenseTrackerExpense = typeof expenseTrackerExpenses.$inferInsert;

// ============= PROJECT MANAGER TABLES =============

export const projectManagerProjects = mysqlTable("projectManagerProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planning", "active", "on_hold", "completed", "cancelled"]).default("planning").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: int("budget"), // in cents
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("project_manager_project_userId_idx").on(table.userId),
  statusIdx: index("project_manager_project_status_idx").on(table.status),
}));

export type ProjectManagerProject = typeof projectManagerProjects.$inferSelect;
export type InsertProjectManagerProject = typeof projectManagerProjects.$inferInsert;

export const projectManagerTasks = mysqlTable("projectManagerTasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "review", "done"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  assignee: varchar("assignee", { length: 255 }),
  dueDate: timestamp("dueDate"),
  estimatedHours: decimal("estimatedHours", { precision: 5, scale: 2 }),
  actualHours: decimal("actualHours", { precision: 5, scale: 2 }),
  parentTaskId: int("parentTaskId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("project_manager_task_userId_idx").on(table.userId),
  projectIdIdx: index("project_manager_task_projectId_idx").on(table.projectId),
  statusIdx: index("project_manager_task_status_idx").on(table.status),
}));

export type ProjectManagerTask = typeof projectManagerTasks.$inferSelect;
export type InsertProjectManagerTask = typeof projectManagerTasks.$inferInsert;

export const projectManagerMilestones = mysqlTable("projectManagerMilestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate").notNull(),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("project_manager_milestone_userId_idx").on(table.userId),
  projectIdIdx: index("project_manager_milestone_projectId_idx").on(table.projectId),
}));

export type ProjectManagerMilestone = typeof projectManagerMilestones.$inferSelect;
export type InsertProjectManagerMilestone = typeof projectManagerMilestones.$inferInsert;

// ============= EMAIL MARKETING SUITE TABLES =============

export const emailMarketingLists = mysqlTable("emailMarketingLists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subscriberCount: int("subscriberCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("email_marketing_list_userId_idx").on(table.userId),
}));

export type EmailMarketingList = typeof emailMarketingLists.$inferSelect;
export type InsertEmailMarketingList = typeof emailMarketingLists.$inferInsert;

export const emailMarketingSubscribers = mysqlTable("emailMarketingSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  listId: int("listId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  status: mysqlEnum("status", ["subscribed", "unsubscribed", "bounced", "complained"]).default("subscribed").notNull(),
  tags: json("tags"),
  customFields: json("customFields"),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
}, (table) => ({
  userIdIdx: index("email_marketing_subscriber_userId_idx").on(table.userId),
  listIdIdx: index("email_marketing_subscriber_listId_idx").on(table.listId),
  emailIdx: index("email_marketing_subscriber_email_idx").on(table.email),
}));

export type EmailMarketingSubscriber = typeof emailMarketingSubscribers.$inferSelect;
export type InsertEmailMarketingSubscriber = typeof emailMarketingSubscribers.$inferInsert;

export const emailMarketingCampaigns = mysqlTable("emailMarketingCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  listId: int("listId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  previewText: varchar("previewText", { length: 255 }),
  htmlContent: text("htmlContent").notNull(),
  status: mysqlEnum("status", ["draft", "scheduled", "sending", "sent", "cancelled"]).default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  sentCount: int("sentCount").default(0),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  bounceCount: int("bounceCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("email_marketing_campaign_userId_idx").on(table.userId),
  listIdIdx: index("email_marketing_campaign_listId_idx").on(table.listId),
  statusIdx: index("email_marketing_campaign_status_idx").on(table.status),
}));

export type EmailMarketingCampaign = typeof emailMarketingCampaigns.$inferSelect;
export type InsertEmailMarketingCampaign = typeof emailMarketingCampaigns.$inferInsert;

// ============= CONTRACT GENERATOR TABLES =============

export const contractGenTemplates = mysqlTable("contractGenTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  content: text("content").notNull(),
  variables: json("variables"), // Array of {name, type, description}
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("contract_gen_template_userId_idx").on(table.userId),
  categoryIdx: index("contract_gen_template_category_idx").on(table.category),
}));

export type ContractGenTemplate = typeof contractGenTemplates.$inferSelect;
export type InsertContractGenTemplate = typeof contractGenTemplates.$inferInsert;

export const contractGenContracts = mysqlTable("contractGenContracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  templateId: int("templateId"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "pending_signature", "signed", "expired", "cancelled"]).default("draft").notNull(),
  parties: json("parties").notNull(), // Array of {name, email, role}
  signedBy: json("signedBy"), // Array of {partyEmail, signedAt, signatureUrl}
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("contract_gen_contract_userId_idx").on(table.userId),
  templateIdIdx: index("contract_gen_contract_templateId_idx").on(table.templateId),
  statusIdx: index("contract_gen_contract_status_idx").on(table.status),
}));

export type ContractGenContract = typeof contractGenContracts.$inferSelect;
export type InsertContractGenContract = typeof contractGenContracts.$inferInsert;

// ============= APPOINTMENT SCHEDULER TABLES =============

export const appointmentSchedulerServices = mysqlTable("appointmentSchedulerServices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // minutes
  price: int("price"), // in cents
  color: varchar("color", { length: 7 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("appointment_scheduler_service_userId_idx").on(table.userId),
}));

export type AppointmentSchedulerService = typeof appointmentSchedulerServices.$inferSelect;
export type InsertAppointmentSchedulerService = typeof appointmentSchedulerServices.$inferInsert;

export const appointmentSchedulerAppointments = mysqlTable("appointmentSchedulerAppointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceId: int("serviceId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  status: mysqlEnum("status", ["scheduled", "confirmed", "cancelled", "completed", "no_show"]).default("scheduled").notNull(),
  notes: text("notes"),
  reminderSent: boolean("reminderSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("appointment_scheduler_appointment_userId_idx").on(table.userId),
  serviceIdIdx: index("appointment_scheduler_appointment_serviceId_idx").on(table.serviceId),
  startTimeIdx: index("appointment_scheduler_appointment_startTime_idx").on(table.startTime),
  statusIdx: index("appointment_scheduler_appointment_status_idx").on(table.status),
}));

export type AppointmentSchedulerAppointment = typeof appointmentSchedulerAppointments.$inferSelect;
export type InsertAppointmentSchedulerAppointment = typeof appointmentSchedulerAppointments.$inferInsert;


// ============= TIME TRACKER TABLES =============

export const timeTrackerProjects = mysqlTable("timeTrackerProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }),
  billableRate: int("billableRate"), // cents per hour
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("time_tracker_project_userId_idx").on(table.userId),
}));

export type TimeTrackerProject = typeof timeTrackerProjects.$inferSelect;
export type InsertTimeTrackerProject = typeof timeTrackerProjects.$inferInsert;

export const timeTrackerEntries = mysqlTable("timeTrackerEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  duration: int("duration"), // seconds
  isBillable: boolean("isBillable").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("time_tracker_entry_userId_idx").on(table.userId),
  projectIdIdx: index("time_tracker_entry_projectId_idx").on(table.projectId),
  startTimeIdx: index("time_tracker_entry_startTime_idx").on(table.startTime),
}));

export type TimeTrackerEntry = typeof timeTrackerEntries.$inferSelect;
export type InsertTimeTrackerEntry = typeof timeTrackerEntries.$inferInsert;

// ============= LEAD MANAGEMENT TABLES =============

export const leadManagementLeads = mysqlTable("leadManagementLeads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  title: varchar("title", { length: 255 }),
  source: varchar("source", { length: 100 }),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]).default("new").notNull(),
  score: int("score").default(0), // 0-100
  estimatedValue: int("estimatedValue"), // cents
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("lead_mgmt_lead_userId_idx").on(table.userId),
  statusIdx: index("lead_mgmt_lead_status_idx").on(table.status),
  scoreIdx: index("lead_mgmt_lead_score_idx").on(table.score),
}));

export type LeadManagementLead = typeof leadManagementLeads.$inferSelect;
export type InsertLeadManagementLead = typeof leadManagementLeads.$inferInsert;

export const leadManagementActivities = mysqlTable("leadManagementActivities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  leadId: int("leadId").notNull(),
  type: mysqlEnum("type", ["call", "email", "meeting", "note", "task"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("lead_mgmt_activity_userId_idx").on(table.userId),
  leadIdIdx: index("lead_mgmt_activity_leadId_idx").on(table.leadId),
}));

export type LeadManagementActivity = typeof leadManagementActivities.$inferSelect;
export type InsertLeadManagementActivity = typeof leadManagementActivities.$inferInsert;

// ============= HELP DESK TABLES =============

export const helpDeskTickets = mysqlTable("helpDeskTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  description: text("description").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting", "resolved", "closed"]).default("open").notNull(),
  category: varchar("category", { length: 100 }),
  assignedTo: int("assignedTo"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("help_desk_ticket_userId_idx").on(table.userId),
  statusIdx: index("help_desk_ticket_status_idx").on(table.status),
  priorityIdx: index("help_desk_ticket_priority_idx").on(table.priority),
  assignedToIdx: index("help_desk_ticket_assignedTo_idx").on(table.assignedTo),
}));

export type HelpDeskTicket = typeof helpDeskTickets.$inferSelect;
export type InsertHelpDeskTicket = typeof helpDeskTickets.$inferInsert;

export const helpDeskReplies = mysqlTable("helpDeskReplies", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId"),
  isStaff: boolean("isStaff").default(false),
  message: text("message").notNull(),
  attachments: json("attachments").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  ticketIdIdx: index("help_desk_reply_ticketId_idx").on(table.ticketId),
}));

export type HelpDeskReply = typeof helpDeskReplies.$inferSelect;
export type InsertHelpDeskReply = typeof helpDeskReplies.$inferInsert;

// ============= INVENTORY MANAGER TABLES =============

export const inventoryProducts = mysqlTable("inventoryProducts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  currentStock: int("currentStock").default(0).notNull(),
  minStock: int("minStock").default(0),
  maxStock: int("maxStock"),
  unitCost: int("unitCost"), // cents
  unitPrice: int("unitPrice"), // cents
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("inventory_product_userId_idx").on(table.userId),
  skuIdx: index("inventory_product_sku_idx").on(table.sku),
}));

export type InventoryProduct = typeof inventoryProducts.$inferSelect;
export type InsertInventoryProduct = typeof inventoryProducts.$inferInsert;

export const inventoryMovements = mysqlTable("inventoryMovements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  type: mysqlEnum("type", ["purchase", "sale", "adjustment", "return", "transfer"]).notNull(),
  quantity: int("quantity").notNull(),
  reference: varchar("reference", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("inventory_movement_userId_idx").on(table.userId),
  productIdIdx: index("inventory_movement_productId_idx").on(table.productId),
  typeIdx: index("inventory_movement_type_idx").on(table.type),
}));

export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type InsertInventoryMovement = typeof inventoryMovements.$inferInsert;

// ============= ORDER MANAGEMENT TABLES =============

export const orderManagementOrders = mysqlTable("orderManagementOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  shippingAddress: json("shippingAddress").$type<{street: string, city: string, state: string, zip: string, country: string}>(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(), // cents
  tax: int("tax").default(0), // cents
  shipping: int("shipping").default(0), // cents
  total: int("total").notNull(), // cents
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("order_mgmt_order_userId_idx").on(table.userId),
  orderNumberIdx: index("order_mgmt_order_orderNumber_idx").on(table.orderNumber),
  statusIdx: index("order_mgmt_order_status_idx").on(table.status),
}));

export type OrderManagementOrder = typeof orderManagementOrders.$inferSelect;
export type InsertOrderManagementOrder = typeof orderManagementOrders.$inferInsert;

export const orderManagementItems = mysqlTable("orderManagementItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(), // cents
  total: int("total").notNull(), // cents
}, (table) => ({
  orderIdIdx: index("order_mgmt_item_orderId_idx").on(table.orderId),
}));

export type OrderManagementItem = typeof orderManagementItems.$inferSelect;
export type InsertOrderManagementItem = typeof orderManagementItems.$inferInsert;


// ============= COMPREHENSIVE TAX APP TABLES =============

export const taxReturns = mysqlTable("taxReturns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taxYear: int("taxYear").notNull(),
  filingStatus: mysqlEnum("filingStatus", ["single", "married_joint", "married_separate", "head_of_household"]).notNull(),
  status: mysqlEnum("status", ["draft", "in_progress", "review", "filed", "accepted", "rejected"]).default("draft").notNull(),
  federalRefund: int("federalRefund").default(0), // cents
  stateRefund: int("stateRefund").default(0), // cents
  filedDate: timestamp("filedDate"),
  dueDate: timestamp("dueDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("tax_return_userId_idx").on(table.userId),
  taxYearIdx: index("tax_return_taxYear_idx").on(table.taxYear),
  statusIdx: index("tax_return_status_idx").on(table.status),
}));

export type TaxReturn = typeof taxReturns.$inferSelect;
export type InsertTaxReturn = typeof taxReturns.$inferInsert;

export const taxDocuments = mysqlTable("taxDocuments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taxYear: int("taxYear").notNull(),
  type: mysqlEnum("type", ["W2", "1099", "1098", "K1", "other"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  processed: boolean("processed").default(false),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tax_document_userId_idx").on(table.userId),
  taxYearIdx: index("tax_document_taxYear_idx").on(table.taxYear),
  typeIdx: index("tax_document_type_idx").on(table.type),
}));

export type TaxDocument = typeof taxDocuments.$inferSelect;
export type InsertTaxDocument = typeof taxDocuments.$inferInsert;

export const taxDeductions = mysqlTable("taxDeductions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taxReturnId: int("taxReturnId"),
  category: varchar("category", { length: 100 }).notNull(),
  amount: int("amount").notNull(), // cents
  description: text("description").notNull(),
  eligible: boolean("eligible").default(true),
  claimed: boolean("claimed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tax_deduction_userId_idx").on(table.userId),
  taxReturnIdIdx: index("tax_deduction_taxReturnId_idx").on(table.taxReturnId),
  categoryIdx: index("tax_deduction_category_idx").on(table.category),
}));

export type TaxDeduction = typeof taxDeductions.$inferSelect;
export type InsertTaxDeduction = typeof taxDeductions.$inferInsert;

export const taxEstimates = mysqlTable("taxEstimates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taxYear: int("taxYear").notNull(),
  income: int("income").notNull(), // cents
  filingStatus: varchar("filingStatus", { length: 50 }).notNull(),
  state: varchar("state", { length: 2 }),
  taxableIncome: int("taxableIncome").notNull(), // cents
  federalTax: int("federalTax").notNull(), // cents
  stateTax: int("stateTax").default(0), // cents
  totalTax: int("totalTax").notNull(), // cents
  effectiveRate: int("effectiveRate").notNull(), // basis points (e.g., 2250 = 22.50%)
  estimatedRefund: int("estimatedRefund").default(0), // cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tax_estimate_userId_idx").on(table.userId),
  taxYearIdx: index("tax_estimate_taxYear_idx").on(table.taxYear),
}));

export type TaxEstimate = typeof taxEstimates.$inferSelect;
export type InsertTaxEstimate = typeof taxEstimates.$inferInsert;
