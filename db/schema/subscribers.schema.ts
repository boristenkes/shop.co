import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'

export const subscribers = pgTable(
	'subscribers',
	{
		id: serial().primaryKey(),
		email: text().unique().notNull(),
		subscribedAt: timestamp().defaultNow()
	},
	t => [uniqueIndex().on(t.email)]
)

export type Subscriber = typeof subscribers.$inferSelect
export type NewSubcriber = typeof subscribers.$inferInsert
