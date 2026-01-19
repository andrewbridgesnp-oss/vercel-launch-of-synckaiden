CREATE TABLE `onboardingProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStep` int NOT NULL DEFAULT 1,
	`totalSteps` int NOT NULL DEFAULT 10,
	`completedSteps` json,
	`skippedSteps` json,
	`onboardingType` enum('full','quick','custom') NOT NULL DEFAULT 'full',
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboardingProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `onboardingProgress_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `onboardingResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` varchar(100) NOT NULL,
	`questionText` text NOT NULL,
	`response` text NOT NULL,
	`responseType` enum('text','choice','scale','multiple') NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `onboardingResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personalityProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileType` enum('myers_briggs','big_five','disc','enneagram','custom') NOT NULL,
	`primaryType` varchar(50) NOT NULL,
	`secondaryTraits` json,
	`strengths` json,
	`growthAreas` json,
	`workStyle` text,
	`communicationPreferences` json,
	`stressManagement` text,
	`motivations` json,
	`idealEnvironment` text,
	`careerSuggestions` json,
	`relationshipInsights` text,
	`aiAnalysis` text,
	`completionPercentage` int DEFAULT 0,
	`status` enum('incomplete','completed','needs_review') NOT NULL DEFAULT 'incomplete',
	`completedAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personalityProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `personalityProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `tribeEventAttendees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`memberId` int NOT NULL,
	`status` enum('pending','confirmed','declined','attended') NOT NULL DEFAULT 'confirmed',
	`rsvpDate` timestamp NOT NULL DEFAULT (now()),
	`metadata` json,
	CONSTRAINT `tribeEventAttendees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tribeEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventType` enum('bucket_list','game_night','social','adventure','meetup','workshop') NOT NULL,
	`location` varchar(255),
	`lat` decimal(10,8),
	`lng` decimal(11,8),
	`isRevealed` boolean DEFAULT false,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`maxAttendees` int,
	`currentAttendees` int DEFAULT 0,
	`status` enum('draft','published','in_progress','completed','canceled') NOT NULL DEFAULT 'draft',
	`tags` json,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tribeEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tribeMemberRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`raterId` int NOT NULL,
	`ratedMemberId` int NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`eventId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tribeMemberRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tribeMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`bio` text,
	`avatar` varchar(500),
	`location` varchar(255),
	`lat` decimal(10,8),
	`lng` decimal(11,8),
	`interests` json,
	`rating` decimal(3,2) DEFAULT '5.00',
	`ratingCount` int DEFAULT 0,
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`lastActive` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tribeMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tribeMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int,
	`eventId` int,
	`content` text NOT NULL,
	`messageType` enum('text','image','location','system') NOT NULL DEFAULT 'text',
	`isRead` boolean DEFAULT false,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tribeMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `progress_userId_idx` ON `onboardingProgress` (`userId`);--> statement-breakpoint
CREATE INDEX `progress_status_idx` ON `onboardingProgress` (`status`);--> statement-breakpoint
CREATE INDEX `onboarding_userId_idx` ON `onboardingResponses` (`userId`);--> statement-breakpoint
CREATE INDEX `onboarding_questionId_idx` ON `onboardingResponses` (`questionId`);--> statement-breakpoint
CREATE INDEX `personality_userId_idx` ON `personalityProfiles` (`userId`);--> statement-breakpoint
CREATE INDEX `personality_profileType_idx` ON `personalityProfiles` (`profileType`);--> statement-breakpoint
CREATE INDEX `personality_status_idx` ON `personalityProfiles` (`status`);--> statement-breakpoint
CREATE INDEX `attendee_eventId_idx` ON `tribeEventAttendees` (`eventId`);--> statement-breakpoint
CREATE INDEX `attendee_memberId_idx` ON `tribeEventAttendees` (`memberId`);--> statement-breakpoint
CREATE INDEX `attendee_status_idx` ON `tribeEventAttendees` (`status`);--> statement-breakpoint
CREATE INDEX `tribeEvent_creatorId_idx` ON `tribeEvents` (`creatorId`);--> statement-breakpoint
CREATE INDEX `tribeEvent_status_idx` ON `tribeEvents` (`status`);--> statement-breakpoint
CREATE INDEX `tribeEvent_startTime_idx` ON `tribeEvents` (`startTime`);--> statement-breakpoint
CREATE INDEX `tribeEvent_eventType_idx` ON `tribeEvents` (`eventType`);--> statement-breakpoint
CREATE INDEX `rating_raterId_idx` ON `tribeMemberRatings` (`raterId`);--> statement-breakpoint
CREATE INDEX `rating_ratedMemberId_idx` ON `tribeMemberRatings` (`ratedMemberId`);--> statement-breakpoint
CREATE INDEX `rating_eventId_idx` ON `tribeMemberRatings` (`eventId`);--> statement-breakpoint
CREATE INDEX `tribeMember_userId_idx` ON `tribeMembers` (`userId`);--> statement-breakpoint
CREATE INDEX `tribeMember_location_idx` ON `tribeMembers` (`location`);--> statement-breakpoint
CREATE INDEX `tribeMember_status_idx` ON `tribeMembers` (`status`);--> statement-breakpoint
CREATE INDEX `message_senderId_idx` ON `tribeMessages` (`senderId`);--> statement-breakpoint
CREATE INDEX `message_recipientId_idx` ON `tribeMessages` (`recipientId`);--> statement-breakpoint
CREATE INDEX `message_eventId_idx` ON `tribeMessages` (`eventId`);--> statement-breakpoint
CREATE INDEX `message_createdAt_idx` ON `tribeMessages` (`createdAt`);