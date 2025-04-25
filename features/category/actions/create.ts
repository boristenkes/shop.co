'use server'

import { db } from '@/db'
import { categories } from '@/db/schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify } from '@/lib/utils'
import { eq } from 'drizzle-orm'
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

		const existingCategorySlug = await db.query.categories
			.findFirst({
				where: eq(categories.slug, slug),
				columns: { id: true }
			})
			.then(Boolean)

		if (existingCategorySlug)
			throw new Error(
				`A category with this name or a similar name already exists.`
			)

		const newCategory = await db
			.insert(categories)
			.values({ name, slug })
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
