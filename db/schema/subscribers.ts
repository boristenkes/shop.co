import { serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { createTable } from './_root'

export const subscribers = createTable(
	'subscribers',
	{
		id: serial().primaryKey(),
		email: text().unique().notNull(),
		subscribedAt: timestamp({ withTimezone: true }).notNull().defaultNow()
	},
	t => [uniqueIndex().on(t.email)]
)

export type Subscriber = typeof subscribers.$inferSelect
export type NewSubcriber = typeof subscribers.$inferInsert
