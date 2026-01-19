CREATE TABLE `applicants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobPostingId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`resumeUrl` varchar(500),
	`coverLetter` text,
	`status` enum('new','screening','interview','offer','hired','rejected') NOT NULL DEFAULT 'new',
	`aiScore` int,
	`notes` text,
	`interviewDate` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applicants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brunnerTests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`loanType` varchar(100) NOT NULL,
	`loanAmount` int NOT NULL,
	`monthlyPayment` int NOT NULL,
	`monthlyIncome` int NOT NULL,
	`monthlyExpenses` int NOT NULL,
	`dependents` int DEFAULT 0,
	`employmentStatus` varchar(100),
	`medicalConditions` text,
	`goodFaithEfforts` text,
	`prongOneScore` int,
	`prongTwoScore` int,
	`prongThreeScore` int,
	`overallScore` int,
	`likelihood` enum('very_low','low','moderate','high','very_high'),
	`recommendations` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brunnerTests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditDisputes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bureau` enum('equifax','experian','transunion') NOT NULL,
	`accountName` varchar(255) NOT NULL,
	`accountNumber` varchar(100),
	`disputeReason` text NOT NULL,
	`letterContent` text,
	`status` enum('draft','sent','in_review','resolved','rejected') NOT NULL DEFAULT 'draft',
	`sentDate` timestamp,
	`responseDate` timestamp,
	`outcome` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditDisputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crmCompanies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`website` varchar(500),
	`industry` varchar(100),
	`size` varchar(50),
	`revenue` int,
	`address` json,
	`phone` varchar(20),
	`status` enum('active','inactive','prospect') NOT NULL DEFAULT 'active',
	`tags` json,
	`customFields` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crmCompanies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crmContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`email` varchar(320),
	`phone` varchar(20),
	`companyId` int,
	`title` varchar(100),
	`leadScore` int,
	`status` enum('lead','prospect','customer','inactive') NOT NULL DEFAULT 'lead',
	`source` varchar(100),
	`tags` json,
	`customFields` json,
	`lastContactedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crmContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crmDeals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contactId` int,
	`companyId` int,
	`title` varchar(255) NOT NULL,
	`value` int NOT NULL,
	`stage` enum('lead','qualified','proposal','negotiation','closed_won','closed_lost') NOT NULL,
	`probability` int,
	`expectedCloseDate` timestamp,
	`actualCloseDate` timestamp,
	`lostReason` text,
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crmDeals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyId` int,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`department` varchar(100),
	`position` varchar(100),
	`employeeId` varchar(50),
	`hireDate` timestamp,
	`terminationDate` timestamp,
	`status` enum('active','on_leave','terminated','pending') NOT NULL DEFAULT 'active',
	`salary` int,
	`payType` enum('hourly','salary','contract'),
	`manager` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`date` timestamp NOT NULL,
	`merchant` varchar(255),
	`description` text,
	`receiptUrl` varchar(500),
	`paymentMethod` varchar(50),
	`status` enum('pending','approved','rejected','reimbursed') NOT NULL DEFAULT 'pending',
	`approvedBy` int,
	`approvedAt` timestamp,
	`reimbursedAt` timestamp,
	`tags` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financialReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportType` enum('profit_loss','cash_flow','balance_sheet','forecast','budget_vs_actual') NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`data` json NOT NULL,
	`summary` json,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`metadata` json,
	CONSTRAINT `financialReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sku` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`quantity` int NOT NULL DEFAULT 0,
	`reorderPoint` int DEFAULT 0,
	`reorderQuantity` int DEFAULT 0,
	`unitCost` int,
	`unitPrice` int,
	`location` varchar(255),
	`barcode` varchar(100),
	`supplier` varchar(255),
	`status` enum('in_stock','low_stock','out_of_stock','discontinued') NOT NULL DEFAULT 'in_stock',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contactId` int,
	`invoiceNumber` varchar(50) NOT NULL,
	`issueDate` timestamp NOT NULL,
	`dueDate` timestamp NOT NULL,
	`subtotal` int NOT NULL,
	`tax` int DEFAULT 0,
	`total` int NOT NULL,
	`amountPaid` int DEFAULT 0,
	`status` enum('draft','sent','viewed','partial','paid','overdue','canceled') NOT NULL DEFAULT 'draft',
	`lineItems` json,
	`notes` text,
	`paymentTerms` varchar(255),
	`recurring` boolean DEFAULT false,
	`recurringInterval` enum('weekly','monthly','quarterly','yearly'),
	`paidAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `jobPostings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`department` varchar(100),
	`location` varchar(255),
	`employmentType` enum('full_time','part_time','contract','internship') NOT NULL,
	`description` text,
	`requirements` json,
	`salaryMin` int,
	`salaryMax` int,
	`status` enum('draft','active','closed','filled') NOT NULL DEFAULT 'draft',
	`postedDate` timestamp,
	`closedDate` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobPostings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llcDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`llcFormationId` int NOT NULL,
	`documentType` enum('articles_of_organization','operating_agreement','ein_confirmation','certificate','amendment','other') NOT NULL,
	`documentName` varchar(255) NOT NULL,
	`fileUrl` varchar(500),
	`fileKey` varchar(500),
	`generatedContent` text,
	`status` enum('draft','generated','signed','filed') NOT NULL DEFAULT 'draft',
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `llcDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llcFormations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`state` varchar(2) NOT NULL,
	`businessType` varchar(100),
	`businessPurpose` text,
	`registeredAgent` json,
	`members` json,
	`managementStructure` enum('member_managed','manager_managed'),
	`filingFee` int,
	`status` enum('draft','in_progress','filed','approved','rejected') NOT NULL DEFAULT 'draft',
	`filedDate` timestamp,
	`approvedDate` timestamp,
	`ein` varchar(20),
	`documents` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `llcFormations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`contactId` int,
	`orderType` enum('sale','purchase','return','exchange') NOT NULL,
	`status` enum('pending','processing','shipped','delivered','canceled','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` int NOT NULL,
	`tax` int DEFAULT 0,
	`shipping` int DEFAULT 0,
	`total` int NOT NULL,
	`items` json,
	`shippingAddress` json,
	`billingAddress` json,
	`trackingNumber` varchar(255),
	`carrier` varchar(100),
	`shippedAt` timestamp,
	`deliveredAt` timestamp,
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `payrollRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`payPeriodStart` timestamp NOT NULL,
	`payPeriodEnd` timestamp NOT NULL,
	`grossPay` int NOT NULL,
	`netPay` int NOT NULL,
	`federalTax` int,
	`stateTax` int,
	`socialSecurity` int,
	`medicare` int,
	`deductions` json,
	`bonuses` int,
	`overtime` int,
	`status` enum('pending','processed','paid','error') NOT NULL DEFAULT 'pending',
	`paidDate` timestamp,
	`paymentMethod` varchar(50),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payrollRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performanceReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`reviewPeriodStart` timestamp NOT NULL,
	`reviewPeriodEnd` timestamp NOT NULL,
	`overallRating` int,
	`strengths` text,
	`areasForImprovement` text,
	`goals` json,
	`feedback360` json,
	`status` enum('draft','submitted','acknowledged','completed') NOT NULL DEFAULT 'draft',
	`submittedAt` timestamp,
	`acknowledgedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performanceReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionalDirectory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalType` enum('attorney','cpa') NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`firmName` varchar(255),
	`state` varchar(2) NOT NULL,
	`licenseNumber` varchar(100),
	`specialties` json,
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(500),
	`address` json,
	`barVerificationUrl` varchar(500),
	`rating` decimal(3,2),
	`reviewCount` int DEFAULT 0,
	`freeConsultation` boolean DEFAULT false,
	`verified` boolean DEFAULT false,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionalDirectory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dealId` int,
	`contactId` int,
	`title` varchar(255) NOT NULL,
	`content` text,
	`totalAmount` int NOT NULL,
	`lineItems` json,
	`status` enum('draft','sent','viewed','accepted','rejected','expired') NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`viewedAt` timestamp,
	`respondedAt` timestamp,
	`expiresAt` timestamp,
	`signatureUrl` varchar(500),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ptoRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`requestType` enum('vacation','sick','personal','bereavement','unpaid') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`totalDays` decimal(4,1) NOT NULL,
	`reason` text,
	`status` enum('pending','approved','denied','canceled') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`reviewNotes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ptoRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stateRequirements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` varchar(2) NOT NULL,
	`stateName` varchar(100) NOT NULL,
	`filingFee` int NOT NULL,
	`processingTime` varchar(100),
	`annualReportRequired` boolean DEFAULT false,
	`annualReportFee` int,
	`publicationRequired` boolean DEFAULT false,
	`registeredAgentRequired` boolean DEFAULT true,
	`requirements` json,
	`filingUrl` varchar(500),
	`contactInfo` json,
	`metadata` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stateRequirements_id` PRIMARY KEY(`id`),
	CONSTRAINT `stateRequirements_state_unique` UNIQUE(`state`)
);
--> statement-breakpoint
CREATE TABLE `timeTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`clockIn` timestamp NOT NULL,
	`clockOut` timestamp,
	`breakMinutes` int DEFAULT 0,
	`totalHours` decimal(5,2),
	`status` enum('clocked_in','clocked_out','approved','disputed') NOT NULL DEFAULT 'clocked_in',
	`notes` text,
	`approvedBy` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timeTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trustBeneficiaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trustWorkbookId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`relationship` varchar(100),
	`dateOfBirth` timestamp,
	`ssn` varchar(20),
	`beneficiaryType` enum('primary','contingent','remainder') NOT NULL,
	`distributionPercentage` int,
	`distributionConditions` text,
	`specialNeeds` text,
	`contactInfo` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trustBeneficiaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trustJurisdictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jurisdiction` varchar(100) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`perpetualDuration` boolean DEFAULT false,
	`directedTrustsAllowed` boolean DEFAULT false,
	`decantingStatute` boolean DEFAULT false,
	`stateIncomeTax` boolean DEFAULT true,
	`capitalGainsTax` boolean DEFAULT true,
	`estateTax` boolean DEFAULT true,
	`assetProtectionStrength` enum('excellent','good','moderate','limited'),
	`privacyProtections` enum('strong','moderate','limited'),
	`advantages` json,
	`disadvantages` json,
	`estimatedSetupCost` int,
	`annualMaintenanceCost` int,
	`metadata` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trustJurisdictions_id` PRIMARY KEY(`id`),
	CONSTRAINT `trustJurisdictions_jurisdiction_unique` UNIQUE(`jurisdiction`)
);
--> statement-breakpoint
CREATE TABLE `trustWorkbooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trustName` varchar(255) NOT NULL,
	`trustType` enum('dynasty','irrevocable','revocable','ilit') NOT NULL DEFAULT 'dynasty',
	`jurisdiction` enum('south_dakota','nevada','delaware','other'),
	`grantorInfo` json,
	`trusteeInfo` json,
	`trustProtector` json,
	`beneficiaries` json,
	`assetProtectionGoals` text,
	`taxConsiderations` json,
	`distributionRules` json,
	`estimatedAssetValue` int,
	`status` enum('draft','in_review','attorney_review','completed') NOT NULL DEFAULT 'draft',
	`completedAt` timestamp,
	`attorneyNotes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trustWorkbooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`contactName` varchar(255),
	`email` varchar(320),
	`phone` varchar(20),
	`website` varchar(500),
	`address` json,
	`paymentTerms` varchar(255),
	`taxId` varchar(50),
	`status` enum('active','inactive','blocked') NOT NULL DEFAULT 'active',
	`performanceRating` int,
	`notes` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflowExecutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`status` enum('running','completed','failed','canceled') NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`triggerData` json,
	`stepResults` json,
	`errorMessage` text,
	`metadata` json,
	CONSTRAINT `workflowExecutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflowSteps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`stepOrder` int NOT NULL,
	`stepType` enum('action','condition','approval','delay') NOT NULL,
	`actionType` varchar(100),
	`config` json,
	`conditions` json,
	`approvalRequired` boolean DEFAULT false,
	`approverUserId` int,
	`retryOnFailure` boolean DEFAULT false,
	`maxRetries` int DEFAULT 3,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflowSteps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`triggerType` enum('time_based','event_based','webhook','manual') NOT NULL,
	`triggerConfig` json,
	`status` enum('active','inactive','draft') NOT NULL DEFAULT 'draft',
	`executionCount` int DEFAULT 0,
	`lastExecutedAt` timestamp,
	`errorCount` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `applicant_jobPostingId_idx` ON `applicants` (`jobPostingId`);--> statement-breakpoint
CREATE INDEX `applicant_status_idx` ON `applicants` (`status`);--> statement-breakpoint
CREATE INDEX `applicant_email_idx` ON `applicants` (`email`);--> statement-breakpoint
CREATE INDEX `brunner_userId_idx` ON `brunnerTests` (`userId`);--> statement-breakpoint
CREATE INDEX `brunner_overallScore_idx` ON `brunnerTests` (`overallScore`);--> statement-breakpoint
CREATE INDEX `dispute_userId_idx` ON `creditDisputes` (`userId`);--> statement-breakpoint
CREATE INDEX `dispute_bureau_idx` ON `creditDisputes` (`bureau`);--> statement-breakpoint
CREATE INDEX `dispute_status_idx` ON `creditDisputes` (`status`);--> statement-breakpoint
CREATE INDEX `company_userId_idx` ON `crmCompanies` (`userId`);--> statement-breakpoint
CREATE INDEX `company_name_idx` ON `crmCompanies` (`name`);--> statement-breakpoint
CREATE INDEX `contact_userId_idx` ON `crmContacts` (`userId`);--> statement-breakpoint
CREATE INDEX `contact_email_idx` ON `crmContacts` (`email`);--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `crmContacts` (`status`);--> statement-breakpoint
CREATE INDEX `deal_userId_idx` ON `crmDeals` (`userId`);--> statement-breakpoint
CREATE INDEX `deal_stage_idx` ON `crmDeals` (`stage`);--> statement-breakpoint
CREATE INDEX `deal_contactId_idx` ON `crmDeals` (`contactId`);--> statement-breakpoint
CREATE INDEX `employee_userId_idx` ON `employees` (`userId`);--> statement-breakpoint
CREATE INDEX `employee_status_idx` ON `employees` (`status`);--> statement-breakpoint
CREATE INDEX `employee_email_idx` ON `employees` (`email`);--> statement-breakpoint
CREATE INDEX `expense_userId_idx` ON `expenses` (`userId`);--> statement-breakpoint
CREATE INDEX `expense_category_idx` ON `expenses` (`category`);--> statement-breakpoint
CREATE INDEX `expense_status_idx` ON `expenses` (`status`);--> statement-breakpoint
CREATE INDEX `expense_date_idx` ON `expenses` (`date`);--> statement-breakpoint
CREATE INDEX `report_userId_idx` ON `financialReports` (`userId`);--> statement-breakpoint
CREATE INDEX `report_reportType_idx` ON `financialReports` (`reportType`);--> statement-breakpoint
CREATE INDEX `report_periodEnd_idx` ON `financialReports` (`periodEnd`);--> statement-breakpoint
CREATE INDEX `inventory_userId_idx` ON `inventoryItems` (`userId`);--> statement-breakpoint
CREATE INDEX `inventory_sku_idx` ON `inventoryItems` (`sku`);--> statement-breakpoint
CREATE INDEX `inventory_status_idx` ON `inventoryItems` (`status`);--> statement-breakpoint
CREATE INDEX `invoice_userId_idx` ON `invoices` (`userId`);--> statement-breakpoint
CREATE INDEX `invoice_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoice_invoiceNumber_idx` ON `invoices` (`invoiceNumber`);--> statement-breakpoint
CREATE INDEX `job_userId_idx` ON `jobPostings` (`userId`);--> statement-breakpoint
CREATE INDEX `job_status_idx` ON `jobPostings` (`status`);--> statement-breakpoint
CREATE INDEX `llcDoc_llcFormationId_idx` ON `llcDocuments` (`llcFormationId`);--> statement-breakpoint
CREATE INDEX `llcDoc_documentType_idx` ON `llcDocuments` (`documentType`);--> statement-breakpoint
CREATE INDEX `llc_userId_idx` ON `llcFormations` (`userId`);--> statement-breakpoint
CREATE INDEX `llc_status_idx` ON `llcFormations` (`status`);--> statement-breakpoint
CREATE INDEX `llc_state_idx` ON `llcFormations` (`state`);--> statement-breakpoint
CREATE INDEX `order_userId_idx` ON `orders` (`userId`);--> statement-breakpoint
CREATE INDEX `order_orderNumber_idx` ON `orders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `payroll_employeeId_idx` ON `payrollRecords` (`employeeId`);--> statement-breakpoint
CREATE INDEX `payroll_status_idx` ON `payrollRecords` (`status`);--> statement-breakpoint
CREATE INDEX `payroll_payPeriodEnd_idx` ON `payrollRecords` (`payPeriodEnd`);--> statement-breakpoint
CREATE INDEX `review_employeeId_idx` ON `performanceReviews` (`employeeId`);--> statement-breakpoint
CREATE INDEX `review_reviewerId_idx` ON `performanceReviews` (`reviewerId`);--> statement-breakpoint
CREATE INDEX `review_status_idx` ON `performanceReviews` (`status`);--> statement-breakpoint
CREATE INDEX `prof_professionalType_idx` ON `professionalDirectory` (`professionalType`);--> statement-breakpoint
CREATE INDEX `prof_state_idx` ON `professionalDirectory` (`state`);--> statement-breakpoint
CREATE INDEX `prof_verified_idx` ON `professionalDirectory` (`verified`);--> statement-breakpoint
CREATE INDEX `proposal_userId_idx` ON `proposals` (`userId`);--> statement-breakpoint
CREATE INDEX `proposal_status_idx` ON `proposals` (`status`);--> statement-breakpoint
CREATE INDEX `proposal_dealId_idx` ON `proposals` (`dealId`);--> statement-breakpoint
CREATE INDEX `pto_employeeId_idx` ON `ptoRequests` (`employeeId`);--> statement-breakpoint
CREATE INDEX `pto_status_idx` ON `ptoRequests` (`status`);--> statement-breakpoint
CREATE INDEX `stateReq_state_idx` ON `stateRequirements` (`state`);--> statement-breakpoint
CREATE INDEX `time_employeeId_idx` ON `timeTracking` (`employeeId`);--> statement-breakpoint
CREATE INDEX `time_clockIn_idx` ON `timeTracking` (`clockIn`);--> statement-breakpoint
CREATE INDEX `beneficiary_trustWorkbookId_idx` ON `trustBeneficiaries` (`trustWorkbookId`);--> statement-breakpoint
CREATE INDEX `beneficiary_type_idx` ON `trustBeneficiaries` (`beneficiaryType`);--> statement-breakpoint
CREATE INDEX `jurisdiction_idx` ON `trustJurisdictions` (`jurisdiction`);--> statement-breakpoint
CREATE INDEX `trust_userId_idx` ON `trustWorkbooks` (`userId`);--> statement-breakpoint
CREATE INDEX `trust_status_idx` ON `trustWorkbooks` (`status`);--> statement-breakpoint
CREATE INDEX `trust_jurisdiction_idx` ON `trustWorkbooks` (`jurisdiction`);--> statement-breakpoint
CREATE INDEX `vendor_userId_idx` ON `vendors` (`userId`);--> statement-breakpoint
CREATE INDEX `vendor_name_idx` ON `vendors` (`name`);--> statement-breakpoint
CREATE INDEX `vendor_status_idx` ON `vendors` (`status`);--> statement-breakpoint
CREATE INDEX `execution_workflowId_idx` ON `workflowExecutions` (`workflowId`);--> statement-breakpoint
CREATE INDEX `execution_status_idx` ON `workflowExecutions` (`status`);--> statement-breakpoint
CREATE INDEX `execution_startedAt_idx` ON `workflowExecutions` (`startedAt`);--> statement-breakpoint
CREATE INDEX `step_workflowId_idx` ON `workflowSteps` (`workflowId`);--> statement-breakpoint
CREATE INDEX `step_stepOrder_idx` ON `workflowSteps` (`stepOrder`);--> statement-breakpoint
CREATE INDEX `workflow_userId_idx` ON `workflows` (`userId`);--> statement-breakpoint
CREATE INDEX `workflow_status_idx` ON `workflows` (`status`);