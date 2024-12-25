import { relations } from 'drizzle-orm'
import { pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { products } from './products.schema'

export const categories = pgTable(
	'categories',
	{
		id: serial().primaryKey(),
		name: varchar({ length: 256 }).notNull(),
		slug: varchar({ length: 256 }).notNull().unique()
	},
	t => [uniqueIndex('category_slug_idx').on(t.slug)]
)

export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products)
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
