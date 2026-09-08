CREATE TABLE `academy_deliverables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` text NOT NULL,
	`phase_slug` text NOT NULL,
	`lesson_slug` text NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `academy_deliverables_learner_lesson` ON `academy_deliverables` (`learner_id`,`phase_slug`,`lesson_slug`);--> statement-breakpoint
CREATE TABLE `academy_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` text NOT NULL,
	`phase_slug` text NOT NULL,
	`lesson_slug` text NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`completed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `academy_progress_learner_lesson` ON `academy_progress` (`learner_id`,`phase_slug`,`lesson_slug`);