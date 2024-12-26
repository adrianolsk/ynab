CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`budget_uuid` text NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`account_group` text DEFAULT 'budget' NOT NULL,
	`account_type` text NOT NULL,
	`balance` real DEFAULT 0,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`budget_uuid`) REFERENCES `budgets`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_budget_uuid` ON `accounts` (`budget_uuid`);--> statement-breakpoint
CREATE INDEX `account_uuid` ON `accounts` (`uuid`);--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`user_uuid` text NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`currency` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budgets_uuid_unique` ON `budgets` (`uuid`);--> statement-breakpoint
CREATE INDEX `budget_user_uuid` ON `budgets` (`user_uuid`);--> statement-breakpoint
CREATE TABLE `category_group` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`budget_uuid` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`budget_uuid`) REFERENCES `budgets`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_group_uuid_unique` ON `category_group` (`uuid`);--> statement-breakpoint
CREATE INDEX `category_group_budget_uuid` ON `category_group` (`budget_uuid`);--> statement-breakpoint
CREATE INDEX `category_group_uuid` ON `category_group` (`uuid`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`budget_uuid` text NOT NULL,
	`category_group_uuid` text NOT NULL,
	`name` text NOT NULL,
	`is_income` integer DEFAULT 0,
	`is_hidden` integer DEFAULT 0,
	`is_system` integer DEFAULT 0,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`budget_uuid`) REFERENCES `budgets`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_group_uuid`) REFERENCES `category_group`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_uuid_unique` ON `categories` (`uuid`);--> statement-breakpoint
CREATE INDEX `category_budget_uuid` ON `categories` (`budget_uuid`);--> statement-breakpoint
CREATE INDEX `category_uuid` ON `categories` (`uuid`);--> statement-breakpoint
CREATE TABLE `goals` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`category_uuid` text NOT NULL,
	`target_amount` real NOT NULL,
	`target_date` text NOT NULL,
	`current_amount` real DEFAULT 0,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`category_uuid`) REFERENCES `categories`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `goals_uuid_unique` ON `goals` (`uuid`);--> statement-breakpoint
CREATE INDEX `goals_category_uuid` ON `goals` (`category_uuid`);--> statement-breakpoint
CREATE INDEX `goals_uuid` ON `goals` (`uuid`);--> statement-breakpoint
CREATE TABLE `monthly_allocations` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`budget_uuid` text NOT NULL,
	`category_uuid` text,
	`month` text NOT NULL,
	`allocated_amount` real DEFAULT 0 NOT NULL,
	`rollover_amount` real DEFAULT 0 NOT NULL,
	`spent_amount` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`budget_uuid`) REFERENCES `budgets`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_uuid`) REFERENCES `categories`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_allocations_uuid_unique` ON `monthly_allocations` (`uuid`);--> statement-breakpoint
CREATE INDEX `monthly_allocations_budget_uuid` ON `monthly_allocations` (`budget_uuid`);--> statement-breakpoint
CREATE INDEX `monthly_allocations_uuid` ON `monthly_allocations` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_category_month_budget` ON `monthly_allocations` (`category_uuid`,`month`,`budget_uuid`);--> statement-breakpoint
CREATE TABLE `scheduled_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`account_uuid` text NOT NULL,
	`category_uuid` text,
	`amount` real NOT NULL,
	`frequency` text NOT NULL,
	`next_due_date` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`account_uuid`) REFERENCES `accounts`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_uuid`) REFERENCES `categories`(`uuid`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scheduled_transactions_uuid_unique` ON `scheduled_transactions` (`uuid`);--> statement-breakpoint
CREATE INDEX `scheduled_transactions_account_uuid` ON `scheduled_transactions` (`account_uuid`);--> statement-breakpoint
CREATE TABLE `shared_budgets` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`budget_uuid` text NOT NULL,
	`user_uuid` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`budget_uuid`) REFERENCES `budgets`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shared_budgets_uuid_unique` ON `shared_budgets` (`uuid`);--> statement-breakpoint
CREATE INDEX `shared_budgets_budget_uuid` ON `shared_budgets` (`budget_uuid`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`user_uuid` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_uuid_unique` ON `tags` (`uuid`);--> statement-breakpoint
CREATE INDEX `tags_user_uuid` ON `tags` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `tags_uuid` ON `tags` (`uuid`);--> statement-breakpoint
CREATE TABLE `transaction_tags` (
	`transaction_uuid` text NOT NULL,
	`tag_uuid` text NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`transaction_uuid`) REFERENCES `transactions`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_uuid`) REFERENCES `tags`(`uuid`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `transaction_tags_transaction_uuid` ON `transaction_tags` (`transaction_uuid`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`account_uuid` text NOT NULL,
	`category_id` text,
	`date` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`cleared` integer DEFAULT false,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`account_uuid`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_uuid_unique` ON `transactions` (`uuid`);--> statement-breakpoint
CREATE INDEX `transaction_account_uuid` ON `transactions` (`account_uuid`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`update_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`last_synced_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_uuid_unique` ON `users` (`uuid`);--> statement-breakpoint
CREATE INDEX `user_uuid` ON `users` (`uuid`);