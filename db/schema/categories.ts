import { relations } from 'drizzle-orm'
import { pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { products } from './products'

export const categories = pgTable(
	'categories',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		slug: text().notNull().unique()
	},
	t => [uniqueIndex('category_slug_idx').on(t.slug)]
)

export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products)
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
