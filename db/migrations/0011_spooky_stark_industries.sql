CREATE TYPE "public"."promo_code_type" AS ENUM('percentage', 'fixed');--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" "promo_code_type" DEFAULT 'percentage' NOT NULL,
	"value" integer NOT NULL,
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"min_value_in_cents" integer,
	"active" boolean DEFAULT true NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "code_case_check" CHECK (code = upper(code))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "promo_code_code_idx" ON "promo_codes" USING btree ("code");