CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`title` text NOT NULL,
	`completed` integer NOT NULL
);
