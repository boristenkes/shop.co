CREATE INDEX "order_item_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_item_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_item_color_idx" ON "order_items" USING btree ("color_id");--> statement-breakpoint
CREATE INDEX "order_user_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_coupon_idx" ON "orders" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX "product_category_idx" ON "products" USING btree ("category_id");