import { relations } from 'drizzle-orm'
import { text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { createTable } from './_root'
import { carts } from './carts'
import { coupons } from './coupons'
import { roleEnum } from './enums'
import { orders } from './orders'
import { products } from './products'
import { reviews } from './reviews'

export const users = createTable(
	'users',
	{
		id: text().primaryKey().$defaultFn(ulid),
		name: text().notNull(),
		email: text().unique().notNull(),
		emailVerified: timestamp({ mode: 'date' }),
		hashedPassword: text(),
		role: roleEnum().default('customer').notNull(),
		image: text(),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	t => [uniqueIndex().on(t.email)]
)

export const usersRelations = relations(users, ({ many, one }) => ({
	products: many(products),
	reviews: many(reviews),
	orders: many(orders),
	cart: one(carts),
	coupons: many(coupons)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
