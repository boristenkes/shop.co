'use server'

import { db } from '@/db'
import { ProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { requirePermission } from '@/utils/actions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type DeleteProductFAQReturn =
	| { success: true }
	| { success: false; message?: string }

export async function deleteProductFAQ(
	faqId: ProductFAQ['id'],
	{ path }: { path?: string } = {}
): Promise<DeleteProductFAQReturn> {
	try {
		if (typeof faqId !== 'number' || isNaN(faqId))
			throw new Error('Invalid data')

		await requirePermission('products', ['update'])

		await db.delete(productFAQs).where(eq(productFAQs.id, faqId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_PRODUCT_FAQ]:', error)
		return { success: false }
	}
}
