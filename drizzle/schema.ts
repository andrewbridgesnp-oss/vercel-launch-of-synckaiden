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
