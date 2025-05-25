'use server'

import { db } from '@/db'
import { products } from '@/db/schema'
import { productImages } from '@/db/schema/product-images'
import { requirePermission } from '@/utils/actions'
import { eq, isNotNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'

const uploadthingApi = new UTApi()

type SoftDeleteReturn = { success: true } | { success: false; message: string }

export async function softDeleteProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products'
): Promise<SoftDeleteReturn> {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		await db
			.update(products)
			.set({ deletedAt: new Date() })
			.where(eq(products.id, productId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[SOFT_DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Failed to move to trash. Please try again later.'
		}
	}
}

export async function restoreProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products/trash'
) {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		await db
			.update(products)
			.set({ deletedAt: null })
			.where(eq(products.id, productId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Pleas try again later'
		}
	}
}

type PurgeSoftDeletedProductsReturn =
	| { success: true }
	| { success: false; message: string }

export async function purgeSoftDeletedProducts(
	path = '/dashboard/products/trash'
): Promise<PurgeSoftDeletedProductsReturn> {
	try {
		await requirePermission('products', ['delete'])

		const softDeletedProducts = await db.query.products.findMany({
			where: (products, { isNotNull }) => isNotNull(products.deletedAt),
			columns: { id: true },
			with: {
				images: { columns: { key: true } }
			}
		})

		const imagesToDelete = softDeletedProducts.flatMap(product =>
			product.images.map(image => image.key)
		)

		const deleteImages = uploadthingApi.deleteFiles(imagesToDelete)
		const removeFromDB = db
			.delete(products)
			.where(isNotNull(products.deletedAt))

		await Promise.all([deleteImages, removeFromDB])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[PURGE_SOFT_DELETED_PRODUCTS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while emptying trash bin. Please try again later.'
		}
	}
}

type DeleteProductReturn =
	| { success: true }
	| { success: false; message: string }

export async function deleteProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products/trash'
): Promise<DeleteProductReturn> {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		const productImageKeys = await db.query.productImages
			.findMany({
				where: eq(productImages.productId, productId),
				columns: { key: true }
			})
			.then(images => images.map(image => image.key))

		const deleteImages = uploadthingApi.deleteFiles(productImageKeys)
		const removeFromDB = db.delete(products).where(eq(products.id, productId))

		await Promise.all([deleteImages, removeFromDB])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Pleas try again later'
		}
	}
}
