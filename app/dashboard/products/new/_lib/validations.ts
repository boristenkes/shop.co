import { z } from 'zod'

export const productImageSchema = z
	.instanceof(File)
	.refine(
		file => !file || file.size <= 1024 * 1024 * 4, // 4MB
		'Image must be smaller than 4MB'
	)
	.refine(
		file => file.type.startsWith('image/'),
		'Invalid file type. Must be image'
	)

export const newProductSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string(),
	categories: z.string().array()
})

export type NewProductSchema = z.infer<typeof newProductSchema>
