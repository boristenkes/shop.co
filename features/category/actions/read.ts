'use server'

import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { Category } from '@/db/schema/categories'
import { asc, eq, sql } from 'drizzle-orm'

export type GetCategoriesConfig = {
	throwOnError?: boolean
}

export type GetCategoriesReturn =
	| { success: true; categories: (Category & { productCount: number })[] }
	| { success: false; message: string }

export async function getCategories({
	throwOnError = false
}: GetCategoriesConfig = {}): Promise<GetCategoriesReturn> {
	try {
		const results = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				productCount: sql<number>`COUNT(${products.id}) ::integer` // Count products per category
			})
			.from(categories)
			.leftJoin(products, eq(products.categoryId, categories.id))
			.groupBy(categories.id) // Group by category id to calculate product counts
			.orderBy(asc(categories.id))

		return { success: true, categories: results }
	} catch (error: any) {
		console.error('[GET_CATEGORIES]:', error)
		const errorMessage =
			'Something went wrong while getting categories. Please try again later.'

		if (throwOnError) throw new Error(errorMessage)

		return { success: false, message: errorMessage }
	}
}
