CREATE TABLE `sales_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`total_sales` int NOT NULL DEFAULT 0,
	`cogs` int NOT NULL DEFAULT 0,
	`expenses_other` int NOT NULL DEFAULT 0,
	`refunds_or_discounts` int NOT NULL DEFAULT 0,
	`customer_count` int NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_data_id` PRIMARY KEY(`id`)
);
