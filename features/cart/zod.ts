import { colorSchema } from '@/features/color/zod'
import { productSchema } from '@/features/product/zod'
import { sizes } from '@/lib/enums'
import { integerSchema, requiredString } from '@/utils/zod'
import { z } from 'zod'

export const newCartItemSchema = z.object({
	quantity: integerSchema.lte(20),
	size: z.enum(sizes),
	productId: integerSchema,
	colorId: integerSchema
})

export const editCartItemSchema = newCartItemSchema.partial()

export const userCartItemSchema = z.object({
	id: integerSchema.positive().or(requiredString.uuid()),
	quantity: integerSchema.positive().lte(20),
	size: z.enum(sizes),
	color: colorSchema,
	productPriceInCents: integerSchema.positive(),
	product: productSchema
		.pick({
			id: true,
			name: true,
			slug: true,
			stock: true
		})
		.extend({ image: requiredString.url() })
})

export type UserCartItemSchema = z.infer<typeof userCartItemSchema>
