CREATE TABLE `invoiceGenClients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`company` varchar(255),
	`address` text,
	`taxId` varchar(50),
	`paymentTerms` int DEFAULT 30,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoiceGenClients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoiceGenInvoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`issueDate` timestamp NOT NULL,
	`dueDate` timestamp NOT NULL,
	`subtotal` int NOT NULL,
	`taxRate` decimal(5,2) DEFAULT '0',
	`taxAmount` int DEFAULT 0,
	`total` int NOT NULL,
	`amountPaid` int DEFAULT 0,
	`status` enum('draft','sent','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`terms` text,
	`lineItems` json NOT NULL,
	`sentAt` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoiceGenInvoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoiceGenPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`invoiceId` int NOT NULL,
	`amount` int NOT NULL,
	`paymentMethod` varchar(50),
	`paymentDate` timestamp NOT NULL,
	`transactionId` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoiceGenPayments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `invoice_gen_client_userId_idx` ON `invoiceGenClients` (`userId`);--> statement-breakpoint
CREATE INDEX `invoice_gen_client_email_idx` ON `invoiceGenClients` (`email`);--> statement-breakpoint
CREATE INDEX `invoice_gen_invoice_userId_idx` ON `invoiceGenInvoices` (`userId`);--> statement-breakpoint
CREATE INDEX `invoice_gen_invoice_clientId_idx` ON `invoiceGenInvoices` (`clientId`);--> statement-breakpoint
CREATE INDEX `invoice_gen_invoice_status_idx` ON `invoiceGenInvoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoice_gen_invoice_number_idx` ON `invoiceGenInvoices` (`invoiceNumber`);--> statement-breakpoint
CREATE INDEX `invoice_gen_payment_userId_idx` ON `invoiceGenPayments` (`userId`);--> statement-breakpoint
CREATE INDEX `invoice_gen_payment_invoiceId_idx` ON `invoiceGenPayments` (`invoiceId`);