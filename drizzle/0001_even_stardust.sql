ALTER TABLE "messages" ALTER COLUMN "operand" SET DATA TYPE numeric(30, 4);--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "result_number" SET DATA TYPE numeric(30, 4);--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "starting_number" SET DATA TYPE numeric(30, 4);