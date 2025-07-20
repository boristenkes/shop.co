import { relations } from 'drizzle-orm'
import {
	index,
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { colors } from './colors'
import { coupons } from './coupons'
import { orderStatusEnum, sizeEnum } from './enums'
import { products } from './products'
import { users } from './users'

export const orders = pgTable(
	'orders',
	{
		id: serial().primaryKey(),
		totalPriceInCents: integer().notNull(),
		status: orderStatusEnum().default('pending').notNull(),
		shippingAddress: text(),
		receiptUrl: text(),

		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		couponId: integer().references(() => coupons.id, {
			onDelete: 'set null'
		}),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	t => [
		index('order_user_idx').on(t.userId),
		index('order_coupon_idx').on(t.couponId)
	]
)

export const ordersRelations = relations(orders, ({ many, one }) => ({
	orderItems: many(orderItems),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	coupon: one(coupons, {
		fields: [orders.couponId],
		references: [coupons.id]
	})
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export const orderItems = pgTable(
	'order_items',
	{
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

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	t => [
		index('order_item_product_idx').on(t.productId),
		index('order_item_order_idx').on(t.orderId),
		index('order_item_color_idx').on(t.colorId)
	]
)

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
