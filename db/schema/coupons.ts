import { sql } from 'drizzle-orm'
import {
	boolean,
	check,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { couponTypeEnum } from './enums'

export const coupons = pgTable(
	'coupons',
	{
		id: serial().primaryKey(),
		code: text().notNull(),
		type: couponTypeEnum().default('percentage').notNull(),
		value: integer().notNull(),
		maxUses: integer(),
		usedCount: integer().default(0).notNull(),
		expiresAt: timestamp({ withTimezone: true }),
		minValueInCents: integer(),
		active: boolean().default(true).notNull(),
		description: text(),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	t => [
		uniqueIndex('coupon_code_idx').on(t.code),
		check('coupon_case_check', sql`(code = upper(code))`)
	]
)

export type Coupon = typeof coupons.$inferSelect
export type NewCoupon = typeof coupons.$inferInsert
