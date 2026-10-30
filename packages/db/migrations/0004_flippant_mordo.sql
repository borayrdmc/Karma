ALTER TABLE "products" DROP CONSTRAINT "product_code_unique";--> statement-breakpoint
UPDATE "products" SET "product_name" = 'İsimsiz Ürün' WHERE "product_name" IS NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "product_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_image_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "product_code_and_platform_unique" UNIQUE("product_platform","product_code");