'use server'

import { db } from '@/db'
import { products } from '@/db/schema'
import { NewProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { newProductFAQSchema } from '../zod'

export type CreateProductFAQReturn =
	| { success: true }
	| { success: false; message?: string }

export async function createProductFAQ(
	data: NewProductFAQ,
	{ path }: { path?: string } = {}
): Promise<CreateProductFAQReturn> {
	try {
		const currentUser = await auth().then(session => session?.user)

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'products', ['update'])
		)
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const product = await db.query.products.findFirst({
				where: eq(products.id, data.productId),
				columns: { userId: true }
			})

			if (product?.userId !== currentUser.id)
				return {
					success: false,
					message: 'You can edit FAQs of products created by Demo admin only'
				}
		}

		const parsedData = newProductFAQSchema.parse(data)

		await db.insert(productFAQs).values(parsedData)

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_PRODUCT_FAQ]:', error)
		return { success: false }
	}
}
