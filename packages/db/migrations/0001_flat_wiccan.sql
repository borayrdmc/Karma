DROP INDEX "time_and_id_unique";--> statement-breakpoint
DROP INDEX "user_id_index";--> statement-breakpoint
ALTER TABLE "tracked_products" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "time_and_id_index" ON "price_history" USING btree ("product_id","checked_at");