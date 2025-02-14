import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	check,
	integer,
	pgTable,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { products } from './products'
import { users } from './users'

export const reviews = pgTable(
	'reviews',
	{
		id: serial().primaryKey(),
		comment: text(),
		rating: smallint().notNull(),
		approved: boolean().default(false),

		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
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
