'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { UTApi } from 'uploadthing/server'
import {
	newProductSchema,
	productImageSchema,
	type NewProductSchema
} from './validations'

const uploadthingApi = new UTApi()

export async function createProduct(
	data: NewProductSchema,
	formData: FormData
) {
	try {
		const session = await auth()

		if (!session) throw new Error('Unauthorized')

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
				priceInCents: priceInDollars * 100,
				categories: {
					connect: categoryIds.map(id => ({ id }))
				}
			}
		})

		return { success: true, message: 'Product has been created' }
	} catch (error: any) {
		console.error('[CREATE_PRODUCT]:', error)
		return { success: false, message: error.message as string }
	}
}
