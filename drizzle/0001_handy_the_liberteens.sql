PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`account_uuid` text NOT NULL,
	`category_uuid` text,
	`payee_uuid` text NOT NULL,
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
	FOREIGN KEY (`account_uuid`) REFERENCES `accounts`(`uuid`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_uuid`) REFERENCES `categories`(`uuid`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`payee_uuid`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "uuid", "account_uuid", "category_uuid", "payee_uuid", "date", "amount", "description", "cleared", "created_at", "updated_at", "deleted_at", "last_synced_at", "sync_status", "version") SELECT "id", "uuid", "account_uuid", "category_uuid", "payee_uuid", "date", "amount", "description", "cleared", "created_at", "updated_at", "deleted_at", "last_synced_at", "sync_status", "version" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_uuid_unique` ON `transactions` (`uuid`);--> statement-breakpoint
CREATE INDEX `transaction_account_uuid` ON `transactions` (`account_uuid`);