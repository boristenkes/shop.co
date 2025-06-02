import { couponTypes } from '@/lib/enums'
import { integerSchema, requiredString } from '@/utils/zod'
import { z } from 'zod'

export const newCouponSchema = z.object({
	code: z
		.string()
		.trim()
		.min(3, 'Too short')
		.max(20, 'Too long')
		.transform(value => value.toUpperCase()),
	type: z.enum(couponTypes).default('percentage'),
	value: integerSchema.positive(),
	maxUses: integerSchema.positive().optional().nullable(),
	expiresAt: z.coerce
		.date()
		.optional()
		.nullable()
		.refine(
			date => !date || date.getTime() > Date.now(),
			'Expiration date must be in the future'
		),
	minValueInCents: integerSchema.positive().optional().nullable(),
	active: z.coerce.boolean().default(true).optional(),
	description: z.string().optional().nullable()
})

export type NewCouponSchema = z.infer<typeof newCouponSchema>

export const editCouponSchema = newCouponSchema.partial()

export type EditCouponSchema = z.infer<typeof editCouponSchema>

export const couponSchema = newCouponSchema.extend({
	id: integerSchema.positive(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	stripeCouponId: requiredString,
	stripePromoCodeId: requiredString
})

export type CouponSchema = z.infer<typeof couponSchema>

export const clientCouponSchema = couponSchema.pick({
	id: true,
	code: true,
	value: true,
	type: true,
	stripePromoCodeId: true
})

export type ClientCouponSchema = z.infer<typeof clientCouponSchema>
