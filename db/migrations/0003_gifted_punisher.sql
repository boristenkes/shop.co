ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "colors" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "colors" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "colors" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "colors" ALTER COLUMN "hex_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "key" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DATA TYPE text;