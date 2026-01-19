CREATE TABLE `affiliateOffers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`affiliateLink` varchar(500) NOT NULL,
	`commission` decimal(5,2),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliateOffers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appRegistry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(500),
	`category` varchar(100),
	`routes` json,
	`requiredIntegrations` json,
	`dashboardPath` varchar(255),
	`setupPath` varchar(255),
	`tutorialPath` varchar(255),
	`settingsPath` varchar(255),
	`productId` int,
	`status` enum('active','beta','coming_soon','deprecated') NOT NULL DEFAULT 'active',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appRegistry_id` PRIMARY KEY(`id`),
	CONSTRAINT `appRegistry_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`resource` varchar(100) NOT NULL,
	`resourceId` int,
	`details` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'info',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `boutiqueCart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` varchar(100),
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boutiqueCart_id` PRIMARY KEY(`id`),
	CONSTRAINT `boutique_cart_user_product_unique` UNIQUE(`userId`,`productId`,`variantId`)
);
--> statement-breakpoint
CREATE TABLE `boutiqueOrderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` varchar(100),
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`printfulItemId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `boutiqueOrderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `boutiqueOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','canceled') NOT NULL DEFAULT 'pending',
	`subtotal` int NOT NULL,
	`tax` int DEFAULT 0,
	`shipping` int DEFAULT 0,
	`total` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`paymentProvider` enum('stripe','paypal') NOT NULL,
	`paymentId` varchar(255),
	`printfulOrderId` varchar(100),
	`shippingAddress` json,
	`trackingNumber` varchar(255),
	`trackingUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boutiqueOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `boutiqueOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `boutiqueProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`basePrice` int NOT NULL,
	`image` varchar(500),
	`printfulProductId` varchar(100),
	`printfulSyncVariantId` varchar(100),
	`printFileUrl` varchar(500),
	`mockupUrl` varchar(500),
	`variants` json,
	`tags` json,
	`active` boolean NOT NULL DEFAULT true,
	`sustainabilityImpact` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boutiqueProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brandSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`brandName` varchar(255),
	`logoUrl` varchar(500),
	`colorPrimary` varchar(7),
	`colorSecondary` varchar(7),
	`fontFamily` varchar(100),
	`watermarkUrl` varchar(500),
	`introClipUrl` varchar(500),
	`outroClipUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brandSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `brandSettings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `emailNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`subject` varchar(500) NOT NULL,
	`templateType` enum('welcome','registration','upgrade','special','reminder','support','order_confirmation') NOT NULL,
	`status` enum('pending','sent','failed','bounced') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entitlements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`subscriptionId` int,
	`grantedBy` enum('subscription','bundle','admin','trial') NOT NULL,
	`status` enum('active','expired','revoked') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entitlements_id` PRIMARY KEY(`id`),
	CONSTRAINT `entitlement_user_product_unique` UNIQUE(`userId`,`productId`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`provider` enum('stripe','paypal','square') NOT NULL,
	`providerPaymentId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`productType` enum('subscription','app','bundle','digital_product') NOT NULL,
	`productId` int,
	`subscriptionId` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('facebook','youtube','tiktok','instagram','snapchat') NOT NULL,
	`encryptedToken` text NOT NULL,
	`iv` varchar(32) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformCredentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `platform_cred_user_platform_unique` UNIQUE(`userId`,`platform`)
);
--> statement-breakpoint
CREATE TABLE `postPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoDraftId` int NOT NULL,
	`platform` enum('facebook','youtube','tiktok','instagram','snapchat') NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`status` enum('scheduled','posting','posted','failed') NOT NULL DEFAULT 'scheduled',
	`postId` varchar(255),
	`postUrl` varchar(500),
	`error` text,
	`postedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `postPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`interval` enum('month','year','one_time') NOT NULL,
	`stripePriceId` varchar(255),
	`paypalPlanId` varchar(255),
	`active` boolean NOT NULL DEFAULT true,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('app','bundle','digital_product') NOT NULL,
	`category` varchar(100),
	`image` varchar(500),
	`features` json,
	`requiredIntegrations` json,
	`status` enum('active','inactive','coming_soon') NOT NULL DEFAULT 'active',
	`sortOrder` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` text,
	`avatar` varchar(500),
	`company` varchar(255),
	`website` varchar(500),
	`location` varchar(255),
	`timezone` varchar(50),
	`preferences` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredEmail` varchar(320) NOT NULL,
	`referredUserId` int,
	`status` enum('pending','registered','converted','rewarded') NOT NULL DEFAULT 'pending',
	`rewardType` enum('discount','free_month','credit'),
	`rewardAmount` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`convertedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`content` text,
	`platform` enum('google','internal','trustpilot','other') NOT NULL DEFAULT 'internal',
	`verified` boolean DEFAULT false,
	`discountApplied` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smsNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientPhone` varchar(20) NOT NULL,
	`recipientName` varchar(255),
	`message` text NOT NULL,
	`templateType` enum('welcome','upgrade','special','reminder','appointment','coupon') NOT NULL,
	`status` enum('pending','sent','failed','delivered') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smsNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`priceId` int NOT NULL,
	`provider` enum('stripe','paypal') NOT NULL,
	`providerSubscriptionId` varchar(255) NOT NULL,
	`providerCustomerId` varchar(255),
	`status` enum('active','canceled','past_due','unpaid','trialing') NOT NULL,
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelAtPeriodEnd` boolean DEFAULT false,
	`canceledAt` timestamp,
	`trialStart` timestamp,
	`trialEnd` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trendItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`url` varchar(500),
	`category` varchar(100),
	`score` int DEFAULT 0,
	`scannedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trendItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userApiKeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`service` varchar(100) NOT NULL,
	`keyName` varchar(255) NOT NULL,
	`encryptedKey` text NOT NULL,
	`iv` varchar(32) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`lastUsed` timestamp,
	`expiresAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userApiKeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `apikey_user_service_unique` UNIQUE(`userId`,`service`,`keyName`)
);
--> statement-breakpoint
CREATE TABLE `videoDrafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`videoUrl` varchar(500),
	`thumbnailUrl` varchar(500),
	`status` enum('pending','approved','rejected','scheduled','posted') NOT NULL DEFAULT 'pending',
	`platforms` json,
	`trendSource` varchar(255),
	`affiliateOfferId` int,
	`approvedAt` timestamp,
	`rejectedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoDrafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhookEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` enum('stripe','paypal','printful') NOT NULL,
	`eventId` varchar(255) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`payload` json NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`processedAt` timestamp,
	`error` text,
	`retryCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhookEvents_id` PRIMARY KEY(`id`),
	CONSTRAINT `webhookEvents_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
CREATE TABLE `youtubeAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`watchTime` int DEFAULT 0,
	`ctr` decimal(5,2) DEFAULT '0.00',
	`date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `youtubeAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `youtubeChannels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`channelId` varchar(100) NOT NULL,
	`channelName` varchar(255),
	`apiKey` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtubeChannels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `youtubeVideos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`channelId` int NOT NULL,
	`videoId` varchar(100),
	`title` varchar(500) NOT NULL,
	`description` text,
	`status` enum('draft','scheduled','published','failed') NOT NULL DEFAULT 'draft',
	`scheduledFor` timestamp,
	`publishedAt` timestamp,
	`thumbnailUrl` varchar(500),
	`videoUrl` varchar(500),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtubeVideos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `personalityType` enum('visionary','strategist','executor');--> statement-breakpoint
ALTER TABLE `users` ADD `smsOptIn` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `emailOptIn` boolean DEFAULT true;--> statement-breakpoint
CREATE INDEX `affiliate_userId_idx` ON `affiliateOffers` (`userId`);--> statement-breakpoint
CREATE INDEX `appreg_slug_idx` ON `appRegistry` (`slug`);--> statement-breakpoint
CREATE INDEX `appreg_status_idx` ON `appRegistry` (`status`);--> statement-breakpoint
CREATE INDEX `audit_userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `audit_action_idx` ON `auditLogs` (`action`);--> statement-breakpoint
CREATE INDEX `audit_createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `boutique_cart_userId_idx` ON `boutiqueCart` (`userId`);--> statement-breakpoint
CREATE INDEX `boutique_orderitem_orderId_idx` ON `boutiqueOrderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `boutique_orderitem_productId_idx` ON `boutiqueOrderItems` (`productId`);--> statement-breakpoint
CREATE INDEX `boutique_order_userId_idx` ON `boutiqueOrders` (`userId`);--> statement-breakpoint
CREATE INDEX `boutique_order_orderNumber_idx` ON `boutiqueOrders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `boutique_order_status_idx` ON `boutiqueOrders` (`status`);--> statement-breakpoint
CREATE INDEX `boutique_product_category_idx` ON `boutiqueProducts` (`category`);--> statement-breakpoint
CREATE INDEX `boutique_product_printfulProductId_idx` ON `boutiqueProducts` (`printfulProductId`);--> statement-breakpoint
CREATE INDEX `brand_userId_idx` ON `brandSettings` (`userId`);--> statement-breakpoint
CREATE INDEX `email_status_idx` ON `emailNotifications` (`status`);--> statement-breakpoint
CREATE INDEX `email_createdAt_idx` ON `emailNotifications` (`createdAt`);--> statement-breakpoint
CREATE INDEX `entitlement_userId_idx` ON `entitlements` (`userId`);--> statement-breakpoint
CREATE INDEX `entitlement_productId_idx` ON `entitlements` (`productId`);--> statement-breakpoint
CREATE INDEX `entitlement_status_idx` ON `entitlements` (`status`);--> statement-breakpoint
CREATE INDEX `payment_userId_idx` ON `payments` (`userId`);--> statement-breakpoint
CREATE INDEX `payment_status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `payment_providerPaymentId_idx` ON `payments` (`providerPaymentId`);--> statement-breakpoint
CREATE INDEX `platform_cred_userId_idx` ON `platformCredentials` (`userId`);--> statement-breakpoint
CREATE INDEX `post_plan_userId_idx` ON `postPlans` (`userId`);--> statement-breakpoint
CREATE INDEX `post_plan_videoDraftId_idx` ON `postPlans` (`videoDraftId`);--> statement-breakpoint
CREATE INDEX `post_plan_status_idx` ON `postPlans` (`status`);--> statement-breakpoint
CREATE INDEX `post_plan_scheduledFor_idx` ON `postPlans` (`scheduledFor`);--> statement-breakpoint
CREATE INDEX `price_productId_idx` ON `prices` (`productId`);--> statement-breakpoint
CREATE INDEX `price_stripePriceId_idx` ON `prices` (`stripePriceId`);--> statement-breakpoint
CREATE INDEX `price_paypalPlanId_idx` ON `prices` (`paypalPlanId`);--> statement-breakpoint
CREATE INDEX `product_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `product_type_idx` ON `products` (`type`);--> statement-breakpoint
CREATE INDEX `product_status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE INDEX `profile_userId_idx` ON `profiles` (`userId`);--> statement-breakpoint
CREATE INDEX `referral_referrerId_idx` ON `referrals` (`referrerId`);--> statement-breakpoint
CREATE INDEX `referral_status_idx` ON `referrals` (`status`);--> statement-breakpoint
CREATE INDEX `review_userId_idx` ON `reviews` (`userId`);--> statement-breakpoint
CREATE INDEX `sms_status_idx` ON `smsNotifications` (`status`);--> statement-breakpoint
CREATE INDEX `sms_userId_idx` ON `smsNotifications` (`userId`);--> statement-breakpoint
CREATE INDEX `subscription_userId_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `subscription_productId_idx` ON `subscriptions` (`productId`);--> statement-breakpoint
CREATE INDEX `subscription_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `subscription_providerSubscriptionId_idx` ON `subscriptions` (`providerSubscriptionId`);--> statement-breakpoint
CREATE INDEX `trend_source_idx` ON `trendItems` (`source`);--> statement-breakpoint
CREATE INDEX `trend_scannedAt_idx` ON `trendItems` (`scannedAt`);--> statement-breakpoint
CREATE INDEX `apikey_userId_idx` ON `userApiKeys` (`userId`);--> statement-breakpoint
CREATE INDEX `apikey_service_idx` ON `userApiKeys` (`service`);--> statement-breakpoint
CREATE INDEX `video_draft_userId_idx` ON `videoDrafts` (`userId`);--> statement-breakpoint
CREATE INDEX `video_draft_status_idx` ON `videoDrafts` (`status`);--> statement-breakpoint
CREATE INDEX `webhook_eventId_idx` ON `webhookEvents` (`eventId`);--> statement-breakpoint
CREATE INDEX `webhook_processed_idx` ON `webhookEvents` (`processed`);--> statement-breakpoint
CREATE INDEX `webhook_provider_idx` ON `webhookEvents` (`provider`);--> statement-breakpoint
CREATE INDEX `youtube_analytics_videoId_idx` ON `youtubeAnalytics` (`videoId`);--> statement-breakpoint
CREATE INDEX `youtube_analytics_date_idx` ON `youtubeAnalytics` (`date`);--> statement-breakpoint
CREATE INDEX `youtube_channel_userId_idx` ON `youtubeChannels` (`userId`);--> statement-breakpoint
CREATE INDEX `youtube_channel_channelId_idx` ON `youtubeChannels` (`channelId`);--> statement-breakpoint
CREATE INDEX `youtube_video_userId_idx` ON `youtubeVideos` (`userId`);--> statement-breakpoint
CREATE INDEX `youtube_video_channelId_idx` ON `youtubeVideos` (`channelId`);--> statement-breakpoint
CREATE INDEX `youtube_video_status_idx` ON `youtubeVideos` (`status`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `openId_idx` ON `users` (`openId`);