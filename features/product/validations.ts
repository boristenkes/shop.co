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
	name: z.string().trim().min(1, 'Name is required'),
	description: z
		.string()
		.trim()
		.min(50, 'Too short, make it at least 50 characters')
		.max(1000, 'Too long. Must be less than 1000 characters'),
	price: z
		.number()
		.min(0.1, 'Price is required')
		.max(99999, 'Too expensive. Must be cheaper than $99999'),
	stock: z.number().min(1, 'Must be at least 1 in stock'),
	discount: z
		.number()
		.min(0, 'Discount cannot be negative')
		.max(100, 'Discount cannot be greater than 100%')
		.optional(),
	categories: z.string().trim().array(),
	featured: z.boolean().optional(),
	archived: z.boolean().optional()
})

export type NewProductSchema = z.infer<typeof newProductSchema>
