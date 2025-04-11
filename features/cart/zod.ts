import { Size } from '@/db/schema/enums'
import { z } from 'zod'

export const newCartItemSchema = z.object({
	quantity: z.coerce.number().int().finite().lte(20),
	size: z.nativeEnum(Size),
	productId: z.coerce.number().int().finite(),
	colorId: z.coerce.number().int().positive().finite()
})

export const editCartItemSchema = newCartItemSchema.partial()
