import { relations } from 'drizzle-orm'
import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { roleEnum } from './enums'
import { orders } from './orders'
import { products } from './products'
import { reviews } from './reviews'

export const users = pgTable(
	'users',
	{
		id: serial().primaryKey(),
		name: text(),
		email: text().unique(),
		emailVerified: timestamp({ mode: 'date' }),
		hashedPassword: text(),
		role: roleEnum().default('customer').notNull(),
		image: text(),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	t => [uniqueIndex().on(t.email)]
)

export const usersRelations = relations(users, ({ many }) => ({
	products: many(products),
	reviews: many(reviews),
	orders: many(orders)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
