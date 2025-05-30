'use server'

import { db } from '@/db'
import { ProductFAQ, productFAQs } from '@/db/schema/product-faqs'
import { ProductImage } from '@/db/schema/product-images'
import { Product, products } from '@/db/schema/products'
import { requirePermission } from '@/utils/actions'
import { eq } from 'drizzle-orm'

export type GetProductFAQsForAdminReturn =
	| {
			success: true
			product: Pick<Product, 'id' | 'name' | 'slug'> & {
				faqs: ProductFAQ[]
				images: Pick<ProductImage, 'url'>[]
			}
	  }
	| { success: false; message?: string }

export async function getProductFAQsForAdmin(
	productId: Product['id']
): Promise<GetProductFAQsForAdminReturn> {
	try {
		if (typeof productId !== 'number' || isNaN(productId))
			throw new Error('Invalid data')

		await requirePermission('products', ['update'])

		const product = await db.query.products.findFirst({
			where: eq(products.id, productId),
			columns: {
				id: true,
				name: true,
				slug: true
			},
			with: {
				faqs: {
					orderBy: (faq, { asc }) => asc(faq.id)
				},
				images: {
					columns: { url: true },
					limit: 1
				}
			}
		})

		if (!product) return { success: false, message: 'Product not found' }

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_FAQS_FOR_ADMIN]:', error)
		return { success: false }
	}
}

export type GetProductFAQsReturn =
	| { success: true; faqs: ProductFAQ[] }
	| { success: false; message?: string }

export async function getProductFAQs(
	productId: Product['id']
): Promise<GetProductFAQsReturn> {
	try {
		if (typeof productId !== 'number' || isNaN(productId))
			throw new Error('Invalid data')

		const faqs = await db.query.productFAQs.findMany({
			where: eq(productFAQs.productId, productId),
			orderBy: (faq, { asc }) => asc(faq.id)
		})

		return { success: true, faqs }
	} catch (error) {
		console.error('[GET_PRODUCT_FAQS]:', error)
		return { success: false }
	}
}
