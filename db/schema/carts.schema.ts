import { relations } from 'drizzle-orm'
import {
	integer,
	pgTable,
	serial,
	smallint,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { colors } from './colors.schema'
import { sizeEnum } from './enums'
import { products } from './products.schema'
import { users } from './users.schema'

export const carts = pgTable('carts', {
	id: serial().primaryKey(),

	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
})

export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(users, {
		fields: [carts.userId],
		references: [users.id]
	}),
	cartItems: many(cartItems)
}))

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export const cartItems = pgTable(
	'cart_items',
	{
		id: serial().primaryKey(),
		quantity: smallint().notNull(),
		size: sizeEnum().notNull(),

		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		cartId: integer()
			.notNull()
			.references(() => carts.id, { onDelete: 'cascade' }),
		colorId: integer()
			.notNull()
			.references(() => colors.id, { onDelete: 'cascade' }),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	t => [
		uniqueIndex('cart_item_unique').on(t.cartId, t.productId, t.size, t.colorId)
	]
)

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id]
	}),
	color: one(colors, {
		fields: [cartItems.colorId],
		references: [colors.id]
	})
}))

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert
