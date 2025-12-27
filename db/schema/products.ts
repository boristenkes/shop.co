import { relations } from 'drizzle-orm'
import {
	boolean,
	index,
	integer,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { categories } from './categories'
import { sizeEnum } from './enums'
import { orderItems } from './orders'
import { productFAQs } from './product-faqs'
import { productImages } from './product-images'
import { productsToColors } from './products-to-colors'
import { reviews } from './reviews'
import { users } from './users'

export const products = createTable(
	'products',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		detailsHTML: text(),
		priceInCents: integer().notNull(),
		discount: smallint().default(0),
		stock: integer().default(1).notNull(),
		archived: boolean().default(false).notNull(),
		featured: boolean().default(false).notNull(),
		sizes: sizeEnum().array().notNull(),

		categoryId: integer().references(() => categories.id, {
			onDelete: 'set null'
		}),
		userId: text().references(() => users.id, { onDelete: 'set null' }),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp({ withTimezone: true })
	},
	t => [
		uniqueIndex('product_slug_idx').on(t.slug),
		index('product_category_idx').on(t.categoryId)
	]
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
	reviews: many(reviews),
	faqs: many(productFAQs)
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
