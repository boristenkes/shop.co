ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "product_price_in_cents" integer NOT NULL;--> statement-breakpoint