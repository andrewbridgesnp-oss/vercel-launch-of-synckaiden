CREATE TABLE `appointmentSchedulerAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serviceId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`clientPhone` varchar(20),
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`status` enum('scheduled','confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`reminderSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointmentSchedulerAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointmentSchedulerServices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`price` int,
	`color` varchar(7),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointmentSchedulerServices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contractGenContracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`status` enum('draft','pending_signature','signed','expired','cancelled') NOT NULL DEFAULT 'draft',
	`parties` json NOT NULL,
	`signedBy` json,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contractGenContracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contractGenTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`content` text NOT NULL,
	`variables` json,
	`isPublic` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contractGenTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailMarketingCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`previewText` varchar(255),
	`htmlContent` text NOT NULL,
	`status` enum('draft','scheduled','sending','sent','cancelled') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`sentAt` timestamp,
	`sentCount` int DEFAULT 0,
	`openCount` int DEFAULT 0,
	`clickCount` int DEFAULT 0,
	`bounceCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailMarketingCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailMarketingLists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`subscriberCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailMarketingLists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailMarketingSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`status` enum('subscribed','unsubscribed','bounced','complained') NOT NULL DEFAULT 'subscribed',
	`tags` json,
	`customFields` json,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `emailMarketingSubscribers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenseTrackerCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`icon` varchar(50),
	`color` varchar(7),
	`budget` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenseTrackerCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenseTrackerExpenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`date` timestamp NOT NULL,
	`receiptUrl` varchar(500),
	`merchant` varchar(255),
	`paymentMethod` varchar(50),
	`tags` json,
	`isRecurring` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenseTrackerExpenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectManagerMilestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp NOT NULL,
	`isCompleted` boolean DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectManagerMilestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectManagerProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('planning','active','on_hold','completed','cancelled') NOT NULL DEFAULT 'planning',
	`startDate` timestamp,
	`endDate` timestamp,
	`budget` int,
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectManagerProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectManagerTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('todo','in_progress','review','done') NOT NULL DEFAULT 'todo',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`assignee` varchar(255),
	`dueDate` timestamp,
	`estimatedHours` decimal(5,2),
	`actualHours` decimal(5,2),
	`parentTaskId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectManagerTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `appointment_scheduler_appointment_userId_idx` ON `appointmentSchedulerAppointments` (`userId`);--> statement-breakpoint
CREATE INDEX `appointment_scheduler_appointment_serviceId_idx` ON `appointmentSchedulerAppointments` (`serviceId`);--> statement-breakpoint
CREATE INDEX `appointment_scheduler_appointment_startTime_idx` ON `appointmentSchedulerAppointments` (`startTime`);--> statement-breakpoint
CREATE INDEX `appointment_scheduler_appointment_status_idx` ON `appointmentSchedulerAppointments` (`status`);--> statement-breakpoint
CREATE INDEX `appointment_scheduler_service_userId_idx` ON `appointmentSchedulerServices` (`userId`);--> statement-breakpoint
CREATE INDEX `contract_gen_contract_userId_idx` ON `contractGenContracts` (`userId`);--> statement-breakpoint
CREATE INDEX `contract_gen_contract_templateId_idx` ON `contractGenContracts` (`templateId`);--> statement-breakpoint
CREATE INDEX `contract_gen_contract_status_idx` ON `contractGenContracts` (`status`);--> statement-breakpoint
CREATE INDEX `contract_gen_template_userId_idx` ON `contractGenTemplates` (`userId`);--> statement-breakpoint
CREATE INDEX `contract_gen_template_category_idx` ON `contractGenTemplates` (`category`);--> statement-breakpoint
CREATE INDEX `email_marketing_campaign_userId_idx` ON `emailMarketingCampaigns` (`userId`);--> statement-breakpoint
CREATE INDEX `email_marketing_campaign_listId_idx` ON `emailMarketingCampaigns` (`listId`);--> statement-breakpoint
CREATE INDEX `email_marketing_campaign_status_idx` ON `emailMarketingCampaigns` (`status`);--> statement-breakpoint
CREATE INDEX `email_marketing_list_userId_idx` ON `emailMarketingLists` (`userId`);--> statement-breakpoint
CREATE INDEX `email_marketing_subscriber_userId_idx` ON `emailMarketingSubscribers` (`userId`);--> statement-breakpoint
CREATE INDEX `email_marketing_subscriber_listId_idx` ON `emailMarketingSubscribers` (`listId`);--> statement-breakpoint
CREATE INDEX `email_marketing_subscriber_email_idx` ON `emailMarketingSubscribers` (`email`);--> statement-breakpoint
CREATE INDEX `expense_tracker_category_userId_idx` ON `expenseTrackerCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `expense_tracker_expense_userId_idx` ON `expenseTrackerExpenses` (`userId`);--> statement-breakpoint
CREATE INDEX `expense_tracker_expense_categoryId_idx` ON `expenseTrackerExpenses` (`categoryId`);--> statement-breakpoint
CREATE INDEX `expense_tracker_expense_date_idx` ON `expenseTrackerExpenses` (`date`);--> statement-breakpoint
CREATE INDEX `project_manager_milestone_userId_idx` ON `projectManagerMilestones` (`userId`);--> statement-breakpoint
CREATE INDEX `project_manager_milestone_projectId_idx` ON `projectManagerMilestones` (`projectId`);--> statement-breakpoint
CREATE INDEX `project_manager_project_userId_idx` ON `projectManagerProjects` (`userId`);--> statement-breakpoint
CREATE INDEX `project_manager_project_status_idx` ON `projectManagerProjects` (`status`);--> statement-breakpoint
CREATE INDEX `project_manager_task_userId_idx` ON `projectManagerTasks` (`userId`);--> statement-breakpoint
CREATE INDEX `project_manager_task_projectId_idx` ON `projectManagerTasks` (`projectId`);--> statement-breakpoint
CREATE INDEX `project_manager_task_status_idx` ON `projectManagerTasks` (`status`);