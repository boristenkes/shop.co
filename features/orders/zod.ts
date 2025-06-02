import { orderStatuses, sizes } from '@/lib/enums'
import { integerSchema, requiredString } from '@/utils/zod'
import { z } from 'zod'

export const orderItemSchema = z.object({
	product: z.object({
		name: requiredString,
		image: requiredString.url(),
		priceInCents: z.number().int().finite(),
		discount: z.number().finite().min(0).max(100).optional()
	}),
	color: z.object({
		name: requiredString
	}),
	size: z.enum(sizes),
	quantity: z.number().int().min(1).max(20)
})

export const updateOrderSchema = z
	.object({
		quantity: z.coerce.number().int().positive().finite(),
		status: z.enum(orderStatuses),
		totalPriceInCents: z.coerce.number().int().finite(),
		shippingAddress: requiredString,
		userId: z.coerce.number().int().positive().finite()
	})
	.partial() // Everything optional

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>

export const orderMetadataSchema = z.object({
	cartId: integerSchema,
	userId: integerSchema,
	couponId: integerSchema.optional().nullable()
})

export type OrderMetadataSchema = z.infer<typeof orderMetadataSchema>
