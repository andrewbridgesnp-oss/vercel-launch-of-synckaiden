CREATE TABLE `sigmaCart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` varchar(100),
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sigmaCart_id` PRIMARY KEY(`id`),
	CONSTRAINT `sigma_cart_user_product_unique` UNIQUE(`userId`,`productId`,`variantId`)
);
--> statement-breakpoint
CREATE TABLE `sigmaOrderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` varchar(100),
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	`printfulItemId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sigmaOrderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sigmaOrders` (
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
	CONSTRAINT `sigmaOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `sigmaOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `sigmaProducts` (
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
	`mentalHealthFocus` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sigmaProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `sigma_cart_userId_idx` ON `sigmaCart` (`userId`);--> statement-breakpoint
CREATE INDEX `sigma_orderitem_orderId_idx` ON `sigmaOrderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `sigma_orderitem_productId_idx` ON `sigmaOrderItems` (`productId`);--> statement-breakpoint
CREATE INDEX `sigma_order_userId_idx` ON `sigmaOrders` (`userId`);--> statement-breakpoint
CREATE INDEX `sigma_order_orderNumber_idx` ON `sigmaOrders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `sigma_order_status_idx` ON `sigmaOrders` (`status`);--> statement-breakpoint
CREATE INDEX `sigma_product_category_idx` ON `sigmaProducts` (`category`);--> statement-breakpoint
CREATE INDEX `sigma_product_printfulProductId_idx` ON `sigmaProducts` (`printfulProductId`);