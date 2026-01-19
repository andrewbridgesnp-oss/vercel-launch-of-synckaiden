CREATE TABLE `wealthAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountName` varchar(255) NOT NULL,
	`accountType` enum('brokerage','retirement_401k','retirement_ira','roth_ira','hsa','real_estate','crypto','other') NOT NULL,
	`institution` varchar(255),
	`accountNumber` varchar(100),
	`currentBalance` int NOT NULL,
	`targetAllocation` json,
	`status` enum('active','closed','frozen') NOT NULL DEFAULT 'active',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wealthAccounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wealthGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`goalName` varchar(255) NOT NULL,
	`goalType` enum('retirement','home_purchase','education','emergency_fund','other') NOT NULL,
	`targetAmount` int NOT NULL,
	`currentAmount` int NOT NULL DEFAULT 0,
	`targetDate` timestamp,
	`monthlyContribution` int,
	`description` text,
	`status` enum('active','completed','paused','abandoned') NOT NULL DEFAULT 'active',
	`progress` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wealthGoals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wealthTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`transactionType` enum('contribution','withdrawal','dividend','interest','capital_gain','fee','transfer') NOT NULL,
	`amount` int NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`description` text,
	`category` varchar(100),
	`ticker` varchar(20),
	`shares` decimal(18,8),
	`pricePerShare` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wealthTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `wealth_account_userId_idx` ON `wealthAccounts` (`userId`);--> statement-breakpoint
CREATE INDEX `wealth_account_status_idx` ON `wealthAccounts` (`status`);--> statement-breakpoint
CREATE INDEX `wealth_goal_userId_idx` ON `wealthGoals` (`userId`);--> statement-breakpoint
CREATE INDEX `wealth_goal_status_idx` ON `wealthGoals` (`status`);--> statement-breakpoint
CREATE INDEX `wealth_goal_targetDate_idx` ON `wealthGoals` (`targetDate`);--> statement-breakpoint
CREATE INDEX `wealth_transaction_accountId_idx` ON `wealthTransactions` (`accountId`);--> statement-breakpoint
CREATE INDEX `wealth_transaction_date_idx` ON `wealthTransactions` (`transactionDate`);