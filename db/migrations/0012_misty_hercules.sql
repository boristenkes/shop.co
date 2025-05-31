ALTER TYPE "public"."promo_code_type" RENAME TO "coupon_type";--> statement-breakpoint
ALTER TABLE "promo_codes" RENAME TO "coupons";--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "code_case_check";--> statement-breakpoint
DROP INDEX "promo_code_code_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_code_idx" ON "coupons" USING btree ("code");--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupon_case_check" CHECK ((code = upper(code)));