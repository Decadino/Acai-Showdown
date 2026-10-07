CREATE TABLE `match_results` (
	`match_id` text NOT NULL,
	`player_id` text NOT NULL,
	`name` text NOT NULL,
	`won` integer NOT NULL,
	`score` integer NOT NULL,
	`completed_at` integer NOT NULL,
	PRIMARY KEY(`match_id`, `player_id`)
);
--> statement-breakpoint
CREATE INDEX `results_player_completed` ON `match_results` (`player_id`,`completed_at`);