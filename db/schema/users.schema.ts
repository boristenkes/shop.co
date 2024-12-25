import { relations } from 'drizzle-orm'
import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { roleEnum } from './enums'
import { orders } from './orders.schema'
import { products } from './products.schema'
import { reviews } from './reviews.schema'

export const users = pgTable(
	'users',
	{
		id: serial().primaryKey(),
		name: varchar({ length: 256 }),
		email: text().unique(),
		emailVerified: timestamp({ mode: 'date' }),
		hashedPassword: varchar({ length: 256 }),
		role: roleEnum().default('customer'),
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
