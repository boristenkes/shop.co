DROP INDEX "cart_item_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_item_unique" UNIQUE("cart_id","product_id","size","color_id");