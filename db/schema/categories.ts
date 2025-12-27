import { relations } from 'drizzle-orm'
import { serial, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { products } from './products'

export const categories = createTable(
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
