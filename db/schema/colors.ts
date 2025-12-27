import { relations } from 'drizzle-orm'
import { serial, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { productsToColors } from './products-to-colors'

export const colors = createTable(
	'colors',
	{
		id: serial().primaryKey(),
		slug: text().notNull().unique(),
		name: text().notNull(),
		hexCode: text().notNull() // e.g. "#FF0000"
	},
	t => [uniqueIndex('color_slug_idx').on(t.slug)]
)

export const colorsRelations = relations(colors, ({ many }) => ({
	productsToColors: many(productsToColors)
}))

export type Color = typeof colors.$inferSelect
export type NewColor = typeof colors.$inferInsert
