import { relations } from 'drizzle-orm'
import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { colors } from './colors.schema'
import { products } from './products.schema'

export const productsToColors = pgTable(
	'products_to_colors',
	{
		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		colorId: integer()
			.notNull()
			.references(() => colors.id, { onDelete: 'cascade' })
	},
	t => [
		primaryKey({ columns: [t.productId, t.colorId] }),
		index().on(t.colorId),
		index().on(t.productId)
	]
)

export const productsToColorsRelations = relations(
	productsToColors,
	({ one }) => ({
		product: one(products, {
			fields: [productsToColors.productId],
			references: [products.id]
		}),
		color: one(colors, {
			fields: [productsToColors.colorId],
			references: [colors.id]
		})
	})
)

export type ProductToColor = typeof productsToColors.$inferSelect
export type NewProductToColor = typeof productsToColors.$inferInsert
