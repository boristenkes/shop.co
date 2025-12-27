import { relations } from 'drizzle-orm'
import { integer, serial, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { products } from './products'

export const productImages = createTable(
	'product_images',
	{
		id: serial().primaryKey(),
		url: text().notNull(),
		key: text().notNull().unique(),

		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' })
	},
	t => [uniqueIndex('product_image_key_idx').on(t.key)]
)

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	})
}))

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert
