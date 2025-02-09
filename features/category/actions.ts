'use server'

import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { Category } from '@/db/schema/categories'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify } from '@/lib/utils'
import { asc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requirePermission } from '../action-utils'

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
			categories: (Category & { productCount: string })[]
	  }
	| { success: false; message: string }

export async function getCategories({
	throwOnError = false
}: GetCategoriesConfig = {}): Promise<GetCategoriesReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'categories', ['read'])
		)
			throw new Error('Unauthorized')

		const results = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				productCount: sql<string>`COUNT(${products.id})` // Count products per category
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

		if (throwOnError)
			throw new Error(
				'Something went wrong while getting categories. Please try again later.'
			)

		return {
			success: false,
			message:
				'Something went wrong while getting categories. Please try again later.'
		}
	}
}

export type UpdateCategoryProps = {
	categoryId: number
	newName: string
}

export type UpdateCategoryReturn =
	| { success: true; newName: string }
	| { success: false; message: string }

const newNameSchema = z
	.string()
	.trim()
	.min(1, 'Too short')
	.max(20, 'Too long. Max 20')

export async function updateCategory({
	categoryId,
	newName
}: UpdateCategoryProps): Promise<UpdateCategoryReturn> {
	try {
		await requirePermission('categories', ['update'])

		const validatedName = newNameSchema.parse(newName)

		await db
			.update(categories)
			.set({ name: validatedName, slug: slugify(validatedName) })
			.where(eq(categories.id, categoryId))

		return { success: true, newName: validatedName }
	} catch (error) {
		console.error('[UPDATE_CATEGORY]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later'
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

		const categoryId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('categoryId') as string)

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'categories', ['delete'])
		)
			throw new Error('Unauthorized')

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
