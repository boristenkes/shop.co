import { Size } from '@/db/schema/enums'
import { z } from 'zod'
import { colorSchema } from '../color/zod'
import { productSchema } from '../product/zod'

export const newCartItemSchema = z.object({
	quantity: z.coerce.number().int().finite().lte(20),
	size: z.nativeEnum(Size),
	productId: z.coerce.number().int().finite(),
	colorId: z.coerce.number().int().positive().finite()
})

export const editCartItemSchema = newCartItemSchema.partial()

export const sessionCartItemSchema = z.object({
	id: z.string().uuid().or(z.number().positive().finite()),
	color: colorSchema,
	size: z.nativeEnum(Size),
	quantity: z.coerce.number().int().finite().lte(20),
	product: productSchema
		.pick({
			id: true,
			name: true,
			slug: true,
			priceInCents: true,
			discount: true,
			stock: true
		})
		.extend({ image: z.string().url() })
})
