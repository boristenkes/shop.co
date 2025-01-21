import { z } from 'zod'

export const reviewSchema = z.object({
	comment: z.string().trim().optional(),
	rating: z.coerce.number().int().min(1, 'Rating is required').max(5),
	name: z.string().trim().min(1, 'Name is required'),
	recommended: z.coerce.boolean().default(false)
})

export type ReviewSchema = z.infer<typeof reviewSchema>
