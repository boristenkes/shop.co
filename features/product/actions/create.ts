'use server'

import { db } from '@/db'
import { products, productsToColors } from '@/db/schema'
import { NewProductImage, productImages } from '@/db/schema/product-images'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { sanitizeHTML } from '@/lib/sanitize'
import { slugify } from '@/lib/utils'
import { toCents } from '@/utils/helpers'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'
import { newProductSchema } from '../zod'

const imagesSchema = z
	.object({
		key: z
			.string()
			.trim()
			.min(1, 'Image key is required')
			.max(48, 'Invalid image key'),
		url: z.string().trim().url()
	})
	.array()
	.min(1, 'At least one image is required')
	.max(10, 'Max 10 images allowed')

const uploadthingApi = new UTApi()

export async function createProduct(
	data: z.infer<typeof newProductSchema>,
	images: Omit<NewProductImage, 'productId'>[],
	path = '/dashboard/products'
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'products', ['create'])
		)
			throw new Error('Unauthorized')

		const validatedImages = imagesSchema.parse(images)
		const validatedData = newProductSchema.parse(data)

		const { price: priceInDollars, category, colors, ...rest } = validatedData

		if (rest.detailsHTML) rest.detailsHTML = sanitizeHTML(rest.detailsHTML)

		const [newProduct] = await db
			.insert(products)
			.values({
				slug: slugify(rest.name),
				priceInCents: toCents(priceInDollars),
				categoryId: category,
				userId: currentUser.id,
				...rest
			})
			.returning({ id: products.id })

		if (!newProduct) throw new Error('Failed to insert data in products table')

		const linkColors = db.insert(productsToColors).values(
			colors.map(colorId => ({
				colorId,
				productId: newProduct.id
			}))
		)

		const linkImages = db.insert(productImages).values(
			validatedImages.map(image => ({
				...image,
				productId: newProduct.id
			}))
		)

		await Promise.all([linkColors, linkImages])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_PRODUCT]:', error)

		await uploadthingApi.deleteFiles(images?.map(image => image.key))

		return {
			success: false,
			message:
				'Something went wrong while trying to create new product. Please try again later.'
		}
	}
}
