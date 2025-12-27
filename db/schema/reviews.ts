import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	check,
	integer,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { products } from './products'
import { users } from './users'

export const reviews = createTable(
	'reviews',
	{
		id: serial().primaryKey(),
		comment: text(),
		rating: smallint().notNull(),
		approved: boolean().default(false).notNull(),

		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	t => [
		uniqueIndex().on(t.userId, t.productId),
		check('review_rating_check', sql`${t.rating} between 1 and 5`)
	]
)

export const reviewsRelations = relations(reviews, ({ one }) => ({
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	})
}))

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
