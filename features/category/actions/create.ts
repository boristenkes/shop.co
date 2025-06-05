'use server'

import { DEMO_RESTRICTIONS } from '@/constants'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify } from '@/lib/utils'
import { eq, gt } from 'drizzle-orm'
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

		if (currentUser.role === 'admin:demo') {
			const count = await db.$count(categories, gt(categories.id, 20)) // 20 = ID of last category I inserted

			if (count >= DEMO_RESTRICTIONS.MAX_CATEGORIES)
				return {
					success: false,
					message:
						'Demo limit reached. Please delete one of the categories if you would like to create a new one'
				}
		}

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
