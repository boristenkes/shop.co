ALTER TYPE "public"."coupon_type" RENAME TO "shopco__coupon_type";--> statement-breakpoint
ALTER TYPE "public"."order_status" RENAME TO "shopco__order_status";--> statement-breakpoint
ALTER TYPE "public"."role" RENAME TO "shopco__role";--> statement-breakpoint
ALTER TYPE "public"."size" RENAME TO "shopco__size";--> statement-breakpoint
ALTER TABLE "accounts" RENAME TO "shopco__accounts";--> statement-breakpoint
ALTER TABLE "authenticators" RENAME TO "shopco__authenticators";--> statement-breakpoint
ALTER TABLE "cart_items" RENAME TO "shopco__cart_items";--> statement-breakpoint
ALTER TABLE "carts" RENAME TO "shopco__carts";--> statement-breakpoint
ALTER TABLE "categories" RENAME TO "shopco__categories";--> statement-breakpoint
ALTER TABLE "colors" RENAME TO "shopco__colors";--> statement-breakpoint
ALTER TABLE "coupons" RENAME TO "shopco__coupons";--> statement-breakpoint
ALTER TABLE "order_items" RENAME TO "shopco__order_items";--> statement-breakpoint
ALTER TABLE "orders" RENAME TO "shopco__orders";--> statement-breakpoint
ALTER TABLE "product_faqs" RENAME TO "shopco__product_faqs";--> statement-breakpoint
ALTER TABLE "product_images" RENAME TO "shopco__product_images";--> statement-breakpoint
ALTER TABLE "products" RENAME TO "shopco__products";--> statement-breakpoint
ALTER TABLE "products_to_colors" RENAME TO "shopco__products_to_colors";--> statement-breakpoint
ALTER TABLE "reviews" RENAME TO "shopco__reviews";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "shopco__sessions";--> statement-breakpoint
ALTER TABLE "subscribers" RENAME TO "shopco__subscribers";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "shopco__users";--> statement-breakpoint
ALTER TABLE "verification_tokens" RENAME TO "shopco__verification_tokens";--> statement-breakpoint
ALTER TABLE "shopco__authenticators" DROP CONSTRAINT "authenticators_credentialID_unique";--> statement-breakpoint
ALTER TABLE "shopco__categories" DROP CONSTRAINT "categories_slug_unique";--> statement-breakpoint
ALTER TABLE "shopco__colors" DROP CONSTRAINT "colors_slug_unique";--> statement-breakpoint
ALTER TABLE "shopco__product_images" DROP CONSTRAINT "product_images_key_unique";--> statement-breakpoint
ALTER TABLE "shopco__subscribers" DROP CONSTRAINT "subscribers_email_unique";--> statement-breakpoint
ALTER TABLE "shopco__users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "shopco__reviews" DROP CONSTRAINT "review_rating_check";--> statement-breakpoint
ALTER TABLE "shopco__accounts" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__authenticators" DROP CONSTRAINT "authenticators_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__cart_items" DROP CONSTRAINT "cart_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__cart_items" DROP CONSTRAINT "cart_items_cart_id_carts_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__cart_items" DROP CONSTRAINT "cart_items_color_id_colors_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__carts" DROP CONSTRAINT "carts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__coupons" DROP CONSTRAINT "coupons_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__order_items" DROP CONSTRAINT "order_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__order_items" DROP CONSTRAINT "order_items_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__order_items" DROP CONSTRAINT "order_items_color_id_colors_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__orders" DROP CONSTRAINT "orders_coupon_id_coupons_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__product_faqs" DROP CONSTRAINT "product_faqs_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__product_images" DROP CONSTRAINT "product_images_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__products" DROP CONSTRAINT "products_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" DROP CONSTRAINT "products_to_colors_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" DROP CONSTRAINT "products_to_colors_color_id_colors_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__reviews" DROP CONSTRAINT "reviews_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "shopco__sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "products_to_colors_color_id_index";--> statement-breakpoint
DROP INDEX "products_to_colors_product_id_index";--> statement-breakpoint
DROP INDEX "reviews_user_id_product_id_index";--> statement-breakpoint
DROP INDEX "subscribers_email_index";--> statement-breakpoint
DROP INDEX "users_email_index";--> statement-breakpoint
ALTER TABLE "shopco__accounts" DROP CONSTRAINT "accounts_provider_provider_account_id_pk";--> statement-breakpoint
ALTER TABLE "shopco__authenticators" DROP CONSTRAINT "authenticators_user_id_credential_id_pk";--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" DROP CONSTRAINT "products_to_colors_product_id_color_id_pk";--> statement-breakpoint
ALTER TABLE "shopco__verification_tokens" DROP CONSTRAINT "verification_tokens_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "shopco__products" ALTER COLUMN "sizes" SET DATA TYPE shopco__size[];--> statement-breakpoint
ALTER TABLE "shopco__accounts" ADD CONSTRAINT "shopco__accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "shopco__authenticators" ADD CONSTRAINT "shopco__authenticators_user_id_credential_id_pk" PRIMARY KEY("user_id","credential_id");--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" ADD CONSTRAINT "shopco__products_to_colors_product_id_color_id_pk" PRIMARY KEY("product_id","color_id");--> statement-breakpoint
ALTER TABLE "shopco__verification_tokens" ADD CONSTRAINT "shopco__verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "shopco__accounts" ADD CONSTRAINT "shopco__accounts_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__authenticators" ADD CONSTRAINT "shopco__authenticators_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__cart_items" ADD CONSTRAINT "shopco__cart_items_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__cart_items" ADD CONSTRAINT "shopco__cart_items_cart_id_shopco__carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."shopco__carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__cart_items" ADD CONSTRAINT "shopco__cart_items_color_id_shopco__colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."shopco__colors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__carts" ADD CONSTRAINT "shopco__carts_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__coupons" ADD CONSTRAINT "shopco__coupons_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__order_items" ADD CONSTRAINT "shopco__order_items_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__order_items" ADD CONSTRAINT "shopco__order_items_order_id_shopco__orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."shopco__orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__order_items" ADD CONSTRAINT "shopco__order_items_color_id_shopco__colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."shopco__colors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__orders" ADD CONSTRAINT "shopco__orders_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__orders" ADD CONSTRAINT "shopco__orders_coupon_id_shopco__coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."shopco__coupons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__product_faqs" ADD CONSTRAINT "shopco__product_faqs_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__product_images" ADD CONSTRAINT "shopco__product_images_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__products" ADD CONSTRAINT "shopco__products_category_id_shopco__categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."shopco__categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__products" ADD CONSTRAINT "shopco__products_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" ADD CONSTRAINT "shopco__products_to_colors_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__products_to_colors" ADD CONSTRAINT "shopco__products_to_colors_color_id_shopco__colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."shopco__colors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__reviews" ADD CONSTRAINT "shopco__reviews_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__reviews" ADD CONSTRAINT "shopco__reviews_product_id_shopco__products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."shopco__products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopco__sessions" ADD CONSTRAINT "shopco__sessions_user_id_shopco__users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."shopco__users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shopco__products_to_colors_color_id_index" ON "shopco__products_to_colors" USING btree ("color_id");--> statement-breakpoint
CREATE INDEX "shopco__products_to_colors_product_id_index" ON "shopco__products_to_colors" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shopco__reviews_user_id_product_id_index" ON "shopco__reviews" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shopco__subscribers_email_index" ON "shopco__subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "shopco__users_email_index" ON "shopco__users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "shopco__authenticators" ADD CONSTRAINT "shopco__authenticators_credentialID_unique" UNIQUE("credential_id");--> statement-breakpoint
ALTER TABLE "shopco__categories" ADD CONSTRAINT "shopco__categories_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "shopco__colors" ADD CONSTRAINT "shopco__colors_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "shopco__product_images" ADD CONSTRAINT "shopco__product_images_key_unique" UNIQUE("key");--> statement-breakpoint
ALTER TABLE "shopco__subscribers" ADD CONSTRAINT "shopco__subscribers_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "shopco__users" ADD CONSTRAINT "shopco__users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "shopco__reviews" ADD CONSTRAINT "review_rating_check" CHECK ("shopco__reviews"."rating" between 1 and 5);