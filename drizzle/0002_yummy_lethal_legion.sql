ALTER TABLE `match_results` ADD `achievements` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `match_results` ADD `audience_wins` integer DEFAULT 0 NOT NULL;