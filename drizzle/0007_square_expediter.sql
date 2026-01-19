CREATE TABLE `employeeOsEmployees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` varchar(50) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`department` varchar(100),
	`position` varchar(100),
	`hireDate` timestamp NOT NULL,
	`salary` int,
	`status` enum('active','on_leave','terminated') NOT NULL DEFAULT 'active',
	`emergencyContact` json,
	`documents` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employeeOsEmployees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employeeOsPayroll` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` int NOT NULL,
	`payPeriodStart` timestamp NOT NULL,
	`payPeriodEnd` timestamp NOT NULL,
	`grossPay` int NOT NULL,
	`deductions` json,
	`netPay` int NOT NULL,
	`paymentMethod` enum('direct_deposit','check','cash') NOT NULL,
	`paymentDate` timestamp,
	`status` enum('pending','processed','paid') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employeeOsPayroll_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employeeOsPerformanceReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` int NOT NULL,
	`reviewDate` timestamp NOT NULL,
	`reviewPeriodStart` timestamp NOT NULL,
	`reviewPeriodEnd` timestamp NOT NULL,
	`overallRating` int NOT NULL,
	`strengths` text,
	`areasForImprovement` text,
	`goals` json,
	`reviewerNotes` text,
	`employeeComments` text,
	`status` enum('draft','completed','acknowledged') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employeeOsPerformanceReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employeeOsTimeTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` int NOT NULL,
	`date` timestamp NOT NULL,
	`clockIn` timestamp NOT NULL,
	`clockOut` timestamp,
	`breakMinutes` int DEFAULT 0,
	`totalHours` decimal(5,2),
	`overtimeHours` decimal(5,2) DEFAULT '0',
	`notes` text,
	`approved` boolean DEFAULT false,
	`approvedBy` int,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employeeOsTimeTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `employee_os_employee_userId_idx` ON `employeeOsEmployees` (`userId`);--> statement-breakpoint
CREATE INDEX `employee_os_employee_employeeId_idx` ON `employeeOsEmployees` (`employeeId`);--> statement-breakpoint
CREATE INDEX `employee_os_employee_status_idx` ON `employeeOsEmployees` (`status`);--> statement-breakpoint
CREATE INDEX `employee_os_payroll_userId_idx` ON `employeeOsPayroll` (`userId`);--> statement-breakpoint
CREATE INDEX `employee_os_payroll_employeeId_idx` ON `employeeOsPayroll` (`employeeId`);--> statement-breakpoint
CREATE INDEX `employee_os_payroll_status_idx` ON `employeeOsPayroll` (`status`);--> statement-breakpoint
CREATE INDEX `employee_os_review_userId_idx` ON `employeeOsPerformanceReviews` (`userId`);--> statement-breakpoint
CREATE INDEX `employee_os_review_employeeId_idx` ON `employeeOsPerformanceReviews` (`employeeId`);--> statement-breakpoint
CREATE INDEX `employee_os_review_status_idx` ON `employeeOsPerformanceReviews` (`status`);--> statement-breakpoint
CREATE INDEX `employee_os_time_userId_idx` ON `employeeOsTimeTracking` (`userId`);--> statement-breakpoint
CREATE INDEX `employee_os_time_employeeId_idx` ON `employeeOsTimeTracking` (`employeeId`);--> statement-breakpoint
CREATE INDEX `employee_os_time_date_idx` ON `employeeOsTimeTracking` (`date`);