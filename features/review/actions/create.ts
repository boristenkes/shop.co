'use server'

import { db } from '@/db'
import { NewReview, reviews } from '@/db/schema/reviews'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { and, eq } from 'drizzle-orm'

type CreateReviewReturn =
	| { success: true; reviewId: number }
	| { success: false; message: string }

export async function createReview(
	data: Omit<NewReview, 'userId' | 'approved'>
): Promise<CreateReviewReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'reviews', ['create']))
			throw new Error('Unauthorized')

		const alreadyLeftReview = await db.query.reviews
			.findFirst({
				where: and(
					eq(reviews.userId, currentUser.id),
					eq(reviews.productId, data.productId)
				),
				columns: { id: true }
			})
			.then(Boolean)

		if (alreadyLeftReview) {
			return {
				success: false,
				message: 'You already left review for this product.'
			}
		}

		const [newReview] = await db
			.insert(reviews)
			.values({
				...data,
				userId: currentUser.id,
				approved: !data.comment // Automatically approved if comment isn't included.
			})
			.returning({ id: reviews.id })

		if (!newReview) throw new Error('Failed to create review')

		return { success: true, reviewId: newReview.id }
	} catch (error) {
		console.error('[CREATE_REVIEW]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later.'
		}
	}
}
