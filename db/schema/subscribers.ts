import { pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core'

export const subcribers = pgTable(
	'subscribers',
	{
		id: serial().primaryKey(),
		email: text().unique().notNull()
	},
	t => [uniqueIndex().on(t.email)]
)

export type Subscriber = typeof subcribers.$inferSelect
export type NewSubcriber = typeof subcribers.$inferInsert
