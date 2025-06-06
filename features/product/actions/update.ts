'use server'

import { db } from '@/db'
import { products, productsToColors } from '@/db/schema'
import { NewProductImage, productImages } from '@/db/schema/product-images'
import { NewProduct, Product } from '@/db/schema/products'
import { EditProductSchema, editProductSchema } from '@/features/product/zod'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { sanitizeHTML } from '@/lib/sanitize'
import { slugify } from '@/lib/utils'
import { isEmpty, toCents } from '@/utils/helpers'
import { and, eq, inArray } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'

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

type UpdateProductReturn =
	| { success: true }
	| { success: false; message: string }

export async function updateProduct(
	productId: Product['id'],
	newData: EditProductSchema,
	images?: Omit<NewProductImage, 'productId'>[]
): Promise<UpdateProductReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'products', ['update'])
		)
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const product = await db.query.products.findFirst({
				where: eq(products.id, productId),
				columns: { userId: true }
			})
			if (product?.userId !== currentUser.id)
				return {
					success: false,
					message: 'You can edit products created by Demo admin only'
				}
		}

		const validatedData = editProductSchema.parse(newData)

		if (images) {
			await handleImages(productId, images)
		}

		const {
			price: priceInDollars,
			category: categoryId,
			colors,
			...rest
		} = validatedData

		if (colors && !isEmpty(colors)) {
			await db.transaction(async tx => {
				await tx
					.delete(productsToColors)
					.where(eq(productsToColors.productId, productId))
				await tx.insert(productsToColors).values(
					colors.map(colorId => ({
						colorId,
						productId
					}))
				)
			})
		}

		const updatedData = rest as NewProduct

		if (priceInDollars) updatedData.priceInCents = toCents(priceInDollars)
		if (updatedData.name) updatedData.slug = slugify(updatedData.name)
		if (updatedData.detailsHTML)
			updatedData.detailsHTML = sanitizeHTML(updatedData.detailsHTML)

		if (isEmpty(updatedData)) return { success: true }

		await db
			.update(products)
			.set({
				...updatedData,
				categoryId
			})
			.where(eq(products.id, productId))

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later.'
		}
	}
}

async function handleImages(
	productId: Product['id'],
	images: Omit<NewProductImage, 'productId'>[]
) {
	if (images.length === 0) throw new Error('No images provided')

	// Validate images
	const validatedImages = imagesSchema.parse(images)

	// Fetch current product image keys
	const existingKeys = await db.query.productImages
		.findMany({
			where: eq(productImages.productId, productId),
			columns: { key: true }
		})
		.then(images => images.map(image => image.key))

	// Determine images to delete and add
	const imagesToDelete = existingKeys.filter(key =>
		validatedImages.every(image => image.key !== key)
	)
	const imagesToAdd = validatedImages.filter(
		image => !existingKeys.includes(image.key)
	)

	await db.transaction(async tx => {
		const res = await db
			.delete(productImages)
			.where(
				and(
					eq(productImages.productId, productId),
					inArray(productImages.key, imagesToDelete)
				)
			)

		if (res.rowCount !== imagesToDelete.length) {
			tx.rollback()
		}

		await uploadthingApi.deleteFiles(imagesToDelete)

		if (imagesToAdd.length > 0) {
			await db.insert(productImages).values(
				imagesToAdd.map(image => ({
					...image,
					productId
				}))
			)
		}
	})
}
