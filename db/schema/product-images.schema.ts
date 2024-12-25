import {
	integer,
	pgTable,
	serial,
	text,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { products } from './products.schema'

export const productImages = pgTable(
	'product_images',
	{
		id: serial().primaryKey(),
		url: text().notNull(),
		key: varchar({ length: 48 }).notNull().unique(),

		productId: integer().references(() => products.id, { onDelete: 'cascade' })
	},
	t => [uniqueIndex('product_image_key_idx').on(t.key)]
)

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert
