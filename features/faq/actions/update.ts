'use server'

import { db } from '@/db'
import { ProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { requirePermission } from '@/utils/actions'
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

		await requirePermission('products', ['update'])

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
