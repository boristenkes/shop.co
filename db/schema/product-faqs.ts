import { relations } from 'drizzle-orm'
import { index, integer, serial, text } from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { products } from './products'

export const productFAQs = createTable(
	'product_faqs',
	{
		id: serial().primaryKey(),
		question: text().notNull(),
		answer: text().notNull(),
		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' })
	},
	t => [index('faq_product_id_idx').on(t.productId)]
)

export const productFAQsRelations = relations(productFAQs, ({ one }) => ({
	product: one(products, {
		fields: [productFAQs.productId],
		references: [products.id]
	})
}))

export type ProductFAQ = typeof productFAQs.$inferSelect
export type NewProductFAQ = typeof productFAQs.$inferInsert
