import { relations } from 'drizzle-orm'
import { index, integer, primaryKey } from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { colors } from './colors'
import { products } from './products'

export const productsToColors = createTable(
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
