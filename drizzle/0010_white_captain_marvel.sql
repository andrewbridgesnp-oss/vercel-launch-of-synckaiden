CREATE TABLE `helpDeskReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int,
	`isStaff` boolean DEFAULT false,
	`message` text NOT NULL,
	`attachments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `helpDeskReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `helpDeskTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','waiting','resolved','closed') NOT NULL DEFAULT 'open',
	`category` varchar(100),
	`assignedTo` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `helpDeskTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryMovements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`type` enum('purchase','sale','adjustment','return','transfer') NOT NULL,
	`quantity` int NOT NULL,
	`reference` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryMovements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sku` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`currentStock` int NOT NULL DEFAULT 0,
	`minStock` int DEFAULT 0,
	`maxStock` int,
	`unitCost` int,
	`unitPrice` int,
	`location` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadManagementActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`leadId` int NOT NULL,
	`type` enum('call','email','meeting','note','task') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadManagementActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadManagementLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`title` varchar(255),
	`source` varchar(100),
	`status` enum('new','contacted','qualified','proposal','negotiation','won','lost') NOT NULL DEFAULT 'new',
	`score` int DEFAULT 0,
	`estimatedValue` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leadManagementLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderManagementItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`sku` varchar(100),
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`total` int NOT NULL,
	CONSTRAINT `orderManagementItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderManagementOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`shippingAddress` json,
	`status` enum('pending','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` int NOT NULL,
	`tax` int DEFAULT 0,
	`shipping` int DEFAULT 0,
	`total` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orderManagementOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orderManagementOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `timeTrackerEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`description` text,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`duration` int,
	`isBillable` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeTrackerEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeTrackerProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`color` varchar(7),
	`billableRate` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timeTrackerProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `help_desk_reply_ticketId_idx` ON `helpDeskReplies` (`ticketId`);--> statement-breakpoint
CREATE INDEX `help_desk_ticket_userId_idx` ON `helpDeskTickets` (`userId`);--> statement-breakpoint
CREATE INDEX `help_desk_ticket_status_idx` ON `helpDeskTickets` (`status`);--> statement-breakpoint
CREATE INDEX `help_desk_ticket_priority_idx` ON `helpDeskTickets` (`priority`);--> statement-breakpoint
CREATE INDEX `help_desk_ticket_assignedTo_idx` ON `helpDeskTickets` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `inventory_movement_userId_idx` ON `inventoryMovements` (`userId`);--> statement-breakpoint
CREATE INDEX `inventory_movement_productId_idx` ON `inventoryMovements` (`productId`);--> statement-breakpoint
CREATE INDEX `inventory_movement_type_idx` ON `inventoryMovements` (`type`);--> statement-breakpoint
CREATE INDEX `inventory_product_userId_idx` ON `inventoryProducts` (`userId`);--> statement-breakpoint
CREATE INDEX `inventory_product_sku_idx` ON `inventoryProducts` (`sku`);--> statement-breakpoint
CREATE INDEX `lead_mgmt_activity_userId_idx` ON `leadManagementActivities` (`userId`);--> statement-breakpoint
CREATE INDEX `lead_mgmt_activity_leadId_idx` ON `leadManagementActivities` (`leadId`);--> statement-breakpoint
CREATE INDEX `lead_mgmt_lead_userId_idx` ON `leadManagementLeads` (`userId`);--> statement-breakpoint
CREATE INDEX `lead_mgmt_lead_status_idx` ON `leadManagementLeads` (`status`);--> statement-breakpoint
CREATE INDEX `lead_mgmt_lead_score_idx` ON `leadManagementLeads` (`score`);--> statement-breakpoint
CREATE INDEX `order_mgmt_item_orderId_idx` ON `orderManagementItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `order_mgmt_order_userId_idx` ON `orderManagementOrders` (`userId`);--> statement-breakpoint
CREATE INDEX `order_mgmt_order_orderNumber_idx` ON `orderManagementOrders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `order_mgmt_order_status_idx` ON `orderManagementOrders` (`status`);--> statement-breakpoint
CREATE INDEX `time_tracker_entry_userId_idx` ON `timeTrackerEntries` (`userId`);--> statement-breakpoint
CREATE INDEX `time_tracker_entry_projectId_idx` ON `timeTrackerEntries` (`projectId`);--> statement-breakpoint
CREATE INDEX `time_tracker_entry_startTime_idx` ON `timeTrackerEntries` (`startTime`);--> statement-breakpoint
CREATE INDEX `time_tracker_project_userId_idx` ON `timeTrackerProjects` (`userId`);