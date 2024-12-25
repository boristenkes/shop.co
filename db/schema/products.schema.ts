import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { categories } from './categories.schema'
import { sizeEnum } from './enums'
import { orderItems } from './orders.schema'
import { productImages } from './product-images.schema'
import { reviews } from './reviews.schema'
import { users } from './users.schema'

export const products = pgTable(
	'products',
	{
		id: serial().primaryKey(),
		name: varchar({ length: 256 }).notNull(),
		slug: varchar({ length: 256 }).notNull(),
		description: text(),
		priceInCents: integer().notNull(),
		discount: smallint().default(0),
		stock: integer().default(1),
		archived: boolean().default(false),
		featured: boolean().default(false),
		sizes: sizeEnum().array(),

		categoryId: integer()
			.notNull()
			.references(() => categories.id),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
			.$onUpdate(() => new Date())
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
	orderItems: many(orderItems),
	images: many(productImages),
	reviews: many(reviews)
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
