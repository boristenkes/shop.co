import { requiredString } from '@/utils/zod'
import { z } from 'zod'

export const newProductFAQSchema = z.object({
	question: requiredString,
	answer: requiredString,
	productId: z.coerce.number().int().finite()
})

export type NewProductFAQSchema = z.infer<typeof newProductFAQSchema>

export const editProductFAQSchema = newProductFAQSchema.partial()

export type EditProductFAQSchema = z.infer<typeof editProductFAQSchema>
