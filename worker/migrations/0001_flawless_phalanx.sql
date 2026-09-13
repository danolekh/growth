CREATE TABLE `applications` (
	`id` text PRIMARY KEY,
	`job_id` text,
	`draft_id` text,
	`sent_at` text NOT NULL,
	`salary_asked` text,
	`apps_at_send` integer,
	`resume_variant` text,
	`language` text,
	`stage` text DEFAULT 'sent' NOT NULL,
	`stage_at` text NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY,
	`email` text UNIQUE,
	`name` text,
	`company` text,
	`job_id` text,
	`channel` text,
	`first_seen_at` text NOT NULL,
	`last_seen_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `drafts` (
	`id` text PRIMARY KEY,
	`job_id` text,
	`kind` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`message` text NOT NULL,
	`language` text,
	`salary_ask` text,
	`resume_variant` text,
	`form_notes` text,
	`repo_path` text,
	`run_id` text,
	`tg_message_id` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`message_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`job_id` text,
	`draft_id` text,
	`kind` text NOT NULL,
	`payload` text,
	`at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY,
	`source` text NOT NULL,
	`external_id` text NOT NULL,
	`url` text NOT NULL UNIQUE,
	`title` text NOT NULL,
	`company` text,
	`description` text NOT NULL,
	`posted_at` text,
	`first_seen_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`keywords` text DEFAULT '[]' NOT NULL,
	`flags` text DEFAULT '[]' NOT NULL,
	`filter_reason` text,
	`hot` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`detail` text,
	`tg_message_id` integer
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY,
	`contact_id` text,
	`job_id` text,
	`direction` text NOT NULL,
	`channel` text NOT NULL,
	`subject` text,
	`body_text` text,
	`message_id` text UNIQUE,
	`received_at` text NOT NULL,
	`draft_id` text
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY,
	`kind` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text,
	`ok` integer,
	`stats` text,
	`ip` text
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`job_id` text PRIMARY KEY,
	`skills_fit` integer,
	`winnability` integer,
	`stackability` integer,
	`signal` integer,
	`total` integer,
	`verdict` text DEFAULT 'unscored' NOT NULL,
	`language` text,
	`summary` text,
	`model` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`raw` text,
	`scored_at` text
);
--> statement-breakpoint
CREATE INDEX `drafts_status_idx` ON `drafts` (`status`);--> statement-breakpoint
CREATE INDEX `drafts_job_idx` ON `drafts` (`job_id`);--> statement-breakpoint
CREATE INDEX `jobs_status_idx` ON `jobs` (`status`);--> statement-breakpoint
CREATE INDEX `jobs_source_idx` ON `jobs` (`source`);