'use server'

import { db } from '@/db'
import { Review, reviews } from '@/db/schema/reviews'
import { requirePermission } from '@/features/action-utils'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ApproveReviewReturn =
	| { success: true }
	| { success: false; message: string }

export async function approveReview(
	reviewId: Review['id'],
	path = '/dashboard/reviews'
): Promise<ApproveReviewReturn> {
	try {
		await requirePermission('reviews', ['update'])

		const review = await db
			.update(reviews)
			.set({ approved: true })
			.where(eq(reviews.id, reviewId))
			.returning({ id: reviews.id })

		if (!review) throw new Error('Failed to approve review.')

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[APPROVE_REVIEW]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later.'
		}
	}
}
