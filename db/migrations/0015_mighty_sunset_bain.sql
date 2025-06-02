ALTER TABLE "coupons" ADD COLUMN "stripe_coupon_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "stripe_promo_code_id" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_stripe_promo_code_idx" ON "coupons" USING btree ("stripe_promo_code_id");