import { Size } from '@/db/schema/enums'
import { requiredString } from '@/utils/zod'
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
	size: z.nativeEnum(Size),
	quantity: z.number().int().min(1).max(20)
})
