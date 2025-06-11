import { orderStatuses, sizes } from '@/lib/enums'
import { integerSchema, requiredString } from '@/utils/zod'
import { z } from 'zod'

export const orderItemSchema = z.object({
	product: z.object({
		name: requiredString,
		image: requiredString.url()
	}),
	color: z.object({
		name: requiredString
	}),
	size: z.enum(sizes),
	quantity: z.number().int().min(1).max(20),
	productPriceInCents: integerSchema.positive()
})

export const updateOrderSchema = z
	.object({
		quantity: integerSchema.positive(),
		status: z.enum(orderStatuses),
		totalPriceInCents: integerSchema,
		shippingAddress: requiredString,
		userId: requiredString.ulid()
	})
	.partial() // Everything optional

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>

export const orderMetadataSchema = z.object({
	cartId: integerSchema,
	userId: requiredString.ulid(),
	couponId: integerSchema.optional().nullable()
})

export type OrderMetadataSchema = z.infer<typeof orderMetadataSchema>
