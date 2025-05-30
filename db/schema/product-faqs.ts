import { relations } from 'drizzle-orm'
import { index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { products } from './products'

export const productFAQs = pgTable(
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
