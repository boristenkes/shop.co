import { relations } from 'drizzle-orm'
import {
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { colors } from './colors'
import { orderStatusEnum, sizeEnum } from './enums'
import { products } from './products'
import { users } from './users'

export const orders = pgTable('orders', {
	id: serial().primaryKey(),
	totalPriceInCents: integer().notNull(),
	status: orderStatusEnum().default('pending'),
	shippingAddress: text(),

	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
})

export const ordersRelations = relations(orders, ({ many, one }) => ({
	orderItems: many(orderItems),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	})
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export const orderItems = pgTable('order_items', {
	id: serial().primaryKey(),
	quantity: smallint().notNull(),
	size: sizeEnum().notNull(),
	productPriceInCents: integer().notNull(),

	productId: integer()
		.notNull()
		.references(() => products.id, { onDelete: 'restrict' }),
	orderId: integer()
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	colorId: integer()
		.notNull()
		.references(() => colors.id, { onDelete: 'restrict' }),

	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
})

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	color: one(colors, {
		fields: [orderItems.colorId],
		references: [colors.id]
	})
}))

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
