import { sizes } from '@/lib/enums'
import { formatFileSize } from '@/utils/format'
import { integerSchema, requiredString } from '@/utils/zod'
import { z } from 'zod'

export const productImageSchema = z
	.any()
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
	name: requiredString.min(5, 'Name is too short').max(50, 'Name is too long'),
	description: requiredString
		.min(50, 'Description is too short.')
		.max(1000, 'Description is too long.')
		.optional(),
	detailsHTML: requiredString
		.min(50, 'Details are too short.')
		.max(5000, 'Details are too long.')
		.optional(),
	price: z.coerce
		.number({ required_error: 'Price is required' })
		.positive('Price must be positive number')
		.finite(),
	discount: z.coerce.number().int().nonnegative().lte(100).optional(),
	stock: integerSchema.positive(),
	sizes: z.enum(sizes).array().min(1, 'At least one size is required'),
	colors: integerSchema
		.positive()
		.array()
		.min(1, 'At least one color is required'),
	archived: z.boolean().optional(),
	featured: z.boolean().optional(),
	category: integerSchema.optional()
})

export type NewProductSchema = z.infer<typeof newProductSchema>

export const editProductSchema = newProductSchema.partial()

export type EditProductSchema = z.infer<typeof editProductSchema>

export const productSchema = z.object({
	id: integerSchema.positive(),
	name: requiredString,
	slug: requiredString,
	description: z.string().optional(),
	price: integerSchema.positive(),
	discount: integerSchema.min(0).max(100),
	stock: integerSchema.min(0),
	archived: z.boolean(),
	featured: z.boolean(),
	sizes: z.enum(sizes).array(),
	category: integerSchema.positive(),
	userId: integerSchema.positive(),
	createdAt: requiredString.datetime(),
	updatedAt: requiredString.datetime(),
	deletedAt: requiredString.datetime().optional()
})
