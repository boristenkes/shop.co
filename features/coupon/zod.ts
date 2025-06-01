import { couponTypeEnum } from '@/db/schema'
import { integerSchema } from '@/utils/zod'
import { z } from 'zod'

export const newCouponSchema = z.object({
	code: z
		.string()
		.min(3, 'Too short')
		.max(10, 'Too long')
		.transform(value => value.toUpperCase()),
	type: z.enum(couponTypeEnum.enumValues).default('percentage'),
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
