import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	check,
	integer,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { createTable } from './_root'
import { couponTypeEnum } from './enums'
import { orders } from './orders'
import { users } from './users'

export const coupons = createTable(
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

		userId: text().references(() => users.id, {
			onDelete: 'set null'
		}),

		stripeCouponId: text().notNull(),
		stripePromoCodeId: text().notNull(),

		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	t => [
		uniqueIndex('coupon_code_idx').on(t.code),
		uniqueIndex('coupon_stripe_promo_code_idx').on(t.stripePromoCodeId),
		check('coupon_case_check', sql`(code = upper(code))`)
	]
)

export const couponsRelations = relations(coupons, ({ many, one }) => ({
	orders: many(orders),
	user: one(users, {
		fields: [coupons.userId],
		references: [users.id]
	})
}))

export type Coupon = typeof coupons.$inferSelect
export type NewCoupon = typeof coupons.$inferInsert
