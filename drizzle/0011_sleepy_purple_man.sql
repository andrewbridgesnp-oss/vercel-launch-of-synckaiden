CREATE TABLE `taxDeductions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taxReturnId` int,
	`category` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`description` text NOT NULL,
	`eligible` boolean DEFAULT true,
	`claimed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taxDeductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taxYear` int NOT NULL,
	`type` enum('W2','1099','1098','K1','other') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`processed` boolean DEFAULT false,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taxDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxEstimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taxYear` int NOT NULL,
	`income` int NOT NULL,
	`filingStatus` varchar(50) NOT NULL,
	`state` varchar(2),
	`taxableIncome` int NOT NULL,
	`federalTax` int NOT NULL,
	`stateTax` int DEFAULT 0,
	`totalTax` int NOT NULL,
	`effectiveRate` int NOT NULL,
	`estimatedRefund` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taxEstimates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxReturns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taxYear` int NOT NULL,
	`filingStatus` enum('single','married_joint','married_separate','head_of_household') NOT NULL,
	`status` enum('draft','in_progress','review','filed','accepted','rejected') NOT NULL DEFAULT 'draft',
	`federalRefund` int DEFAULT 0,
	`stateRefund` int DEFAULT 0,
	`filedDate` timestamp,
	`dueDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taxReturns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `tax_deduction_userId_idx` ON `taxDeductions` (`userId`);--> statement-breakpoint
CREATE INDEX `tax_deduction_taxReturnId_idx` ON `taxDeductions` (`taxReturnId`);--> statement-breakpoint
CREATE INDEX `tax_deduction_category_idx` ON `taxDeductions` (`category`);--> statement-breakpoint
CREATE INDEX `tax_document_userId_idx` ON `taxDocuments` (`userId`);--> statement-breakpoint
CREATE INDEX `tax_document_taxYear_idx` ON `taxDocuments` (`taxYear`);--> statement-breakpoint
CREATE INDEX `tax_document_type_idx` ON `taxDocuments` (`type`);--> statement-breakpoint
CREATE INDEX `tax_estimate_userId_idx` ON `taxEstimates` (`userId`);--> statement-breakpoint
CREATE INDEX `tax_estimate_taxYear_idx` ON `taxEstimates` (`taxYear`);--> statement-breakpoint
CREATE INDEX `tax_return_userId_idx` ON `taxReturns` (`userId`);--> statement-breakpoint
CREATE INDEX `tax_return_taxYear_idx` ON `taxReturns` (`taxYear`);--> statement-breakpoint
CREATE INDEX `tax_return_status_idx` ON `taxReturns` (`status`);