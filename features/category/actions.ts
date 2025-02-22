'use server'

import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { Category } from '@/db/schema/categories'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify } from '@/lib/utils'
import { asc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createCategory(
	prev: any,
	formData?: FormData,
	path = '/dashboard/categories'
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'categories', ['create'])
		)
			throw new Error('Unauthorized')

		const name =
			typeof prev === 'string' ? prev : (formData?.get('name') as string)
		const slug = slugify(name)

		if (!name?.length || !slug) throw new Error('Invalid data')

		const existingCategorySlug = await db.query.categories.findFirst({
			where: eq(categories.slug, slug)
		})

		if (existingCategorySlug)
			throw new Error(
				`A category with this name or a similar name already exists.`
			)

		const newCategory = await db
			.insert(categories)
			.values({
				name,
				slug
			})
			.returning({ id: categories.id })

		revalidatePath(path)

		return { success: true, category: newCategory }
	} catch (error: any) {
		console.error('[CREATE_CATEGORY]:', error)
		return {
			success: false,
			message:
				'Something went wrong while adding category. Please try again later'
		}
	}
}

export type GetCategoriesConfig = {
	throwOnError?: boolean
}

export type GetCategoriesReturn =
	| {
			success: true
			categories: (Category & { productCount: number })[]
	  }
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

		return {
			success: true,
			categories: results
		}
	} catch (error: any) {
		console.error('[GET_CATEGORIES]:', error)
		const errorMessage =
			'Something went wrong while getting categories. Please try again later.'

		if (throwOnError) throw new Error(errorMessage)

		return {
			success: false,
			message: errorMessage
		}
	}
}

type DeleteCategoryReturn =
	| { success: true; categoryId: number }
	| { success: false; message: string }

export async function deleteCategory(
	prev: any,
	formData?: FormData,
	path = '/dashboard/categories'
): Promise<DeleteCategoryReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'categories', ['delete'])
		)
			throw new Error('Unauthorized')

		const categoryId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('categoryId') as string)

		const response = await db
			.delete(categories)
			.where(eq(categories.id, categoryId))

		revalidatePath(path)

		return { success: true, categoryId }
	} catch (error: any) {
		console.error('[DELETE_CATEGORY]:', error)
		return {
			success: false,
			message:
				'Something went wrong while deleting category. Please try again later'
		}
	}
}
