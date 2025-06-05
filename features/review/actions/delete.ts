'use server'

import { db } from '@/db'
import { Review, reviews } from '@/db/schema/reviews'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type DeleteReviewReturn =
	| { success: true }
	| { success: false; message?: string }

export async function deleteReview(
	reviewId: Review['id'],
	path = '/dashboard/reviews'
): Promise<DeleteReviewReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		const targetReview = await db.query.reviews.findFirst({
			where: eq(reviews.id, reviewId),
			columns: {},
			with: {
				user: {
					columns: { id: true, role: true }
				}
			}
		})

		if (!hasPermission(currentUser.role, 'reviews', ['delete'])) {
			if (
				targetReview?.user.id === currentUser.id &&
				!hasPermission(currentUser.role, 'reviews', ['delete:own'])
			)
				throw new Error('Unauthorized')
		}

		if (
			currentUser.role === 'admin:demo' &&
			targetReview?.user.role !== 'customer:demo'
		) {
			return {
				success: false,
				message: 'You can delete reviews created by Demo customers only'
			}
		}

		await db.delete(reviews).where(eq(reviews.id, reviewId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_REVIEW]:', error)
		return { success: false }
	}
}
