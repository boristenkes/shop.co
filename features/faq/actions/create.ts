'use server'

import { db } from '@/db'
import { NewProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { requirePermission } from '@/utils/actions'
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
		await requirePermission('products', ['update'])

		const parsedData = newProductFAQSchema.parse(data)

		await db.insert(productFAQs).values(parsedData)

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_PRODUCT_FAQ]:', error)
		return { success: false }
	}
}
