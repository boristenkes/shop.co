ALTER TABLE "product_faqs" DROP CONSTRAINT "product_faqs_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_faqs" ADD CONSTRAINT "product_faqs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;