CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`update_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `custom_name` ON `users` (`id`);