'use server'

import { checkAuthorization } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify, toCents } from '@/lib/utils'
import { Product } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import {
	newProductSchema,
	productImageSchema,
	type NewProductSchema
} from './validations'

const uploadthingApi = new UTApi()

export async function createProduct(
	data: NewProductSchema,
	formData: FormData,
	path = '/dashboard/products'
) {
	try {
		await checkAuthorization()

		const result = newProductSchema.safeParse(data)

		if (!result.success) {
			console.error(result.error.flatten())
			throw new Error('Invalid data')
		}

		const slug = slugify(result.data.name)

		if (!slug.length) throw new Error('Failed to generate slug')

		const providedImages = formData.getAll('images')

		const imageValidationsResults = providedImages.map(image =>
			productImageSchema.safeParse(image)
		)

		if (imageValidationsResults.some(res => !res.success)) {
			console.error(
				imageValidationsResults.map(res =>
					res.error?.flatten().formErrors.join('. ')
				)
			)
			throw new Error('Invalid data')
		}

		const validImages = imageValidationsResults.map(res => res.data) as File[]

		const uploadedImages = await uploadthingApi.uploadFiles(validImages)

		if (uploadedImages.some(image => image.error)) {
			console.error(
				uploadedImages.map(image => image.error?.message).join('. ')
			)
			throw new Error('Invalid data')
		}

		const images = uploadedImages.map(image => ({
			key: image.data?.key!,
			url: image.data?.url!
		}))

		const {
			categories: categoryIds,
			price: priceInDollars,
			...rest
		} = result.data

		await prisma.product.create({
			data: {
				...rest,
				images,
				slug,
				priceInCents: toCents(priceInDollars),
				categories: {
					connect: categoryIds.map(id => ({ id }))
				}
			}
		})

		revalidatePath(path)

		return { success: true, message: 'Successfully created product' }
	} catch (error: any) {
		console.error('[CREATE_PRODUCT]:', error)
		return { success: false, message: error.message as string }
	}
}

type GetProductsForAdmin =
	| { success: true; products: Product[] }
	| { success: false; message: string }

export async function getProductsForAdmin({
	page = 1,
	pageSize = 5
}): Promise<GetProductsForAdmin> {
	try {
		await checkAuthorization()

		const skipAmount = (page - 1) * pageSize

		const products = await prisma.product.findMany({
			include: {
				categories: true
			},
			skip: skipAmount,
			take: pageSize,
			orderBy: { createdAt: 'asc' }
		})

		if (!products)
			throw new Error('Failed to fetch products. Please try again later')

		return { success: true, products }
	} catch (error: any) {
		console.error('[GET_PRODUCTS_FOR_ADMIN]:', error)
		return { success: false, message: error.message }
	}
}

export async function deleteProduct(id: string, path = '/dashboard/products') {
	try {
		await checkAuthorization()

		const deletedProduct = await prisma.product.delete({
			where: { id },
			select: { images: true }
		})

		const imageKeys = deletedProduct.images.map(image => image.key)

		const response = await uploadthingApi.deleteFiles(imageKeys)

		if (!response.success) console.error('Failed to delete product images.')

		revalidatePath(path)

		return { success: true, message: 'Successfully deleted product' }
	} catch (error: any) {
		console.error('[DELETE_PRODUCT]:', error)
		return { success: false, message: error.message }
	}
}
