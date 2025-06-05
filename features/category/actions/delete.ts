'use server'

import { db } from '@/db'
import { categories } from '@/db/schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

		// 65 = ID of last category I inserted
		if (currentUser.role === 'admin:demo' && categoryId <= 65) {
			return {
				success: false,
				message: 'You can delete categories created by Demo admin only'
			}
		}

		await db.delete(categories).where(eq(categories.id, categoryId))

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
