import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { sizeEnum } from './enums'
import { orderItems } from './orders'
import { productImages } from './product-images'
import { productsToColors } from './products-to-colors'
import { reviews } from './reviews'
import { users } from './users'

export const products = pgTable(
	'products',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		priceInCents: integer().notNull(),
		discount: smallint().default(0),
		stock: integer().default(1),
		archived: boolean().default(false),
		featured: boolean().default(false),
		sizes: sizeEnum().array(),

		categoryId: integer().references(() => categories.id, {
			onDelete: 'set null'
		}),
		userId: integer().references(() => users.id, { onDelete: 'set null' }),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp()
	},
	t => [uniqueIndex('product_slug_idx').on(t.slug)]
)

export const productsRelations = relations(products, ({ one, many }) => ({
	user: one(users, {
		fields: [products.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	productsToColors: many(productsToColors),
	orderItems: many(orderItems),
	images: many(productImages),
	reviews: many(reviews)
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
