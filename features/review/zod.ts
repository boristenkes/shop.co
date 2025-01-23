import { z } from 'zod'

export const reviewSchema = z.object({
	comment: z.string().trim().optional(),
	rating: z.coerce.number().int().min(1, 'Rating is required').max(5)
})

export type ReviewSchema = z.infer<typeof reviewSchema>
