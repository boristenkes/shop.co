import { Size } from '@/db/schema/enums'
import { formatFileSize } from '@/utils/format'
import { z } from 'zod'

export const productImageSchema = z
	.instanceof(File)
	.refine(
		file => file.type.startsWith('image/'),
		'Invalid file type. Must be image'
	)
	.refine(
		file => file.size < 4 * 1024 * 1024, // 4MB
		`File too big. Max ${formatFileSize(4 * 1024 * 1024)}`
	)
	.array()
	.max(10, 'Too many images. Max 10')

export const newProductSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.min(5, 'Name is too short')
		.max(50, 'Name is too long'),
	description: z
		.string()
		.trim()
		.min(50, 'Description is too short.')
		.max(1000, 'Description is too long.')
		.optional(),
	price: z.coerce
		.number({ required_error: 'Price is required' })
		.positive('Price must be positive number')
		.finite(),
	discount: z.coerce.number().int().nonnegative().lte(100).optional(),
	stock: z.coerce
		.number({ required_error: 'Stock is required' })
		.int()
		.positive(),
	sizes: z.nativeEnum(Size).array().min(1, 'At least one size is required'),
	colors: z.coerce
		.number()
		.positive()
		.array()
		.min(1, 'At least one color is required'),
	archived: z.boolean().optional(),
	featured: z.boolean().optional(),
	category: z.coerce.number().positive().optional()
})

export type NewProductSchema = z.infer<typeof newProductSchema>

export const editProductSchema = newProductSchema.partial()

export type EditProductSchema = z.infer<typeof editProductSchema>

export const productSchema = z.object({
	id: z.number().int().positive().finite(),
	name: z.string().min(1),
	slug: z.string().min(1),
	description: z.string().optional(),
	priceInCents: z.number().int().positive().finite(),
	discount: z.number().min(0).max(100),
	stock: z.number().min(0).finite(),
	archived: z.boolean(),
	featured: z.boolean(),
	sizes: z.nativeEnum(Size).array(),
	categoryId: z.number().int().positive().finite(),
	userId: z.number().int().positive().finite(),
	createdAt: z.coerce.string().datetime(),
	updatedAt: z.coerce.string().datetime(),
	deletedAt: z.coerce.string().datetime().optional()
})
