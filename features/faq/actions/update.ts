'use server'

import { db } from '@/db'
import { ProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { editProductFAQSchema } from '../zod'

export type UpdateProductFAQReturn =
	| { success: true }
	| { success: false; message?: string }

export async function updateProductFAQ(
	faqId: ProductFAQ['id'],
	newData: Partial<ProductFAQ>,
	{ path }: { path?: string } = {}
): Promise<UpdateProductFAQReturn> {
	try {
		if (typeof faqId !== 'number' || isNaN(faqId))
			throw new Error('Invalid data')

		const currentUser = await auth().then(session => session?.user)

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'products', ['update'])
		)
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const faq = await db.query.productFAQs.findFirst({
				where: eq(productFAQs.id, faqId),
				columns: {},
				with: {
					product: {
						columns: { userId: true }
					}
				}
			})

			if (faq?.product.userId !== currentUser.id)
				return {
					success: false,
					message: 'You can edit FAQs of products created by Demo admin only'
				}
		}

		const parsedNewData = editProductFAQSchema.parse(newData)

		await db
			.update(productFAQs)
			.set(parsedNewData)
			.where(eq(productFAQs.id, faqId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_PRODUCT_FAQ]:', error)
		return { success: false }
	}
}
