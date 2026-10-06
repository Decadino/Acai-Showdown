CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rooms_owner` ON `rooms` (`owner`);--> statement-breakpoint
CREATE INDEX `rooms_expires` ON `rooms` (`expires`);