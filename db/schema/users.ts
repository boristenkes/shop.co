import { relations } from 'drizzle-orm'
import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { carts } from './carts'
import { roleEnum } from './enums'
import { orders } from './orders'
import { products } from './products'
import { reviews } from './reviews'

export const users = pgTable(
	'users',
	{
		id: serial().primaryKey(),
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
	cart: one(carts)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
