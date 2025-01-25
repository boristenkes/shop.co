import { z } from 'zod'

export const reviewSchema = z.object({
	comment: z
		.string()
		.trim()
		.min(20, 'Comment is too short. Minimum 20 characters.')
		.optional(),
	rating: z.coerce.number().int().min(1, 'Rating is required').max(5)
})

export type ReviewSchema = z.infer<typeof reviewSchema>
