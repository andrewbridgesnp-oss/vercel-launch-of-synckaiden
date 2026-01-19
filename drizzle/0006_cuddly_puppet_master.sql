CREATE TABLE `salesCrmContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`company` varchar(255),
	`title` varchar(100),
	`source` varchar(100),
	`status` enum('lead','prospect','customer','inactive') NOT NULL DEFAULT 'lead',
	`tags` json,
	`notes` text,
	`lastContactedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesCrmContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesCrmDeals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contactId` int,
	`title` varchar(255) NOT NULL,
	`value` int NOT NULL,
	`stage` enum('prospecting','qualification','proposal','negotiation','closed_won','closed_lost') NOT NULL DEFAULT 'prospecting',
	`probability` int DEFAULT 0,
	`expectedCloseDate` timestamp,
	`actualCloseDate` timestamp,
	`description` text,
	`lostReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesCrmDeals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesCrmProposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dealId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`totalAmount` int NOT NULL,
	`status` enum('draft','sent','viewed','accepted','rejected') NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`viewedAt` timestamp,
	`respondedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesCrmProposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `sales_crm_contact_userId_idx` ON `salesCrmContacts` (`userId`);--> statement-breakpoint
CREATE INDEX `sales_crm_contact_email_idx` ON `salesCrmContacts` (`email`);--> statement-breakpoint
CREATE INDEX `sales_crm_contact_status_idx` ON `salesCrmContacts` (`status`);--> statement-breakpoint
CREATE INDEX `sales_crm_deal_userId_idx` ON `salesCrmDeals` (`userId`);--> statement-breakpoint
CREATE INDEX `sales_crm_deal_contactId_idx` ON `salesCrmDeals` (`contactId`);--> statement-breakpoint
CREATE INDEX `sales_crm_deal_stage_idx` ON `salesCrmDeals` (`stage`);--> statement-breakpoint
CREATE INDEX `sales_crm_proposal_userId_idx` ON `salesCrmProposals` (`userId`);--> statement-breakpoint
CREATE INDEX `sales_crm_proposal_dealId_idx` ON `salesCrmProposals` (`dealId`);--> statement-breakpoint
CREATE INDEX `sales_crm_proposal_status_idx` ON `salesCrmProposals` (`status`);