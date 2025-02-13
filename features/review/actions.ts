'use server'

import { db } from '@/db'
import { Product } from '@/db/schema/products'
import { NewReview, Review, reviews } from '@/db/schema/reviews'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '../action-utils'

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

		const alredyLeftReview = await db.query.reviews
			.findFirst({
				where: and(
					eq(reviews.userId, currentUser.id),
					eq(reviews.productId, data.productId)
				)
			})
			.then(Boolean)

		if (alredyLeftReview) {
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

export type GetProductReviewsReview = Pick<
	Review,
	'comment' | 'createdAt' | 'rating' | 'id'
> & { user: Pick<User, 'name'> }

export type GetProductReviewsReturn = {
	reviews: GetProductReviewsReview[]
	hasMore: boolean
}

export type GetProductReviewOptions = {
	page?: number
	pageSize?: number
}

export async function getProductReviews(
	productId: Product['id'],
	{ page = 1, pageSize = 6 }: GetProductReviewOptions = {}
): Promise<GetProductReviewsReturn> {
	const reviews = await db.query.reviews.findMany({
		where: (reviews, { eq, and, isNotNull }) =>
			and(
				eq(reviews.productId, productId),
				eq(reviews.approved, true),
				isNotNull(reviews.comment)
			),
		with: {
			user: {
				columns: { name: true }
			}
		},
		columns: {
			comment: true,
			createdAt: true,
			rating: true,
			id: true
		},
		orderBy: (review, { desc }) => desc(review.rating),
		limit: pageSize + 1, // +1 to determine if we've reached the end or not
		offset: (page - 1) * pageSize
	})

	if (!reviews)
		throw new Error(`Failed to fetch reviews for product: ${productId}`)

	let hasMore = false

	if (reviews.length > pageSize) {
		reviews.pop() // Remove extra record
		hasMore = true
	}

	return { reviews, hasMore }
}

export type GetReviewsReturnReview = Review & {
	user: Pick<User, 'id' | 'name' | 'image'>
	product: Pick<Product, 'id' | 'name' | 'slug'>
}

export type GetReviewsReturn =
	| { success: true; reviews: GetReviewsReturnReview[] }
	| { success: false; message: string }

export async function getReviews(): Promise<GetReviewsReturn> {
	try {
		await requirePermission('reviews', ['read'])

		const reviews = await db.query.reviews.findMany({
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true
					}
				},
				product: {
					columns: {
						id: true,
						name: true,
						slug: true
					}
				}
			}
		})

		if (!reviews) throw new Error('Failed to get reviews')

		return { success: true, reviews }
	} catch (error) {
		console.error('[GET_REVIEWS]:', error)
		return { success: false, message: 'Something went wrong' }
	}
}

export async function approveReview(
	reviewId: Review['id'],
	path = '/dashboard/reviews'
) {
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

export type DeleteReviewReturn =
	| { success: true }
	| { success: false; message: string }

export async function deleteReview(
	reviewId: Review['id'],
	path = '/dashboard/reviews'
): Promise<DeleteReviewReturn> {
	try {
		await requirePermission('reviews', ['delete'])

		await db.delete(reviews).where(eq(reviews.id, reviewId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_REVIEW]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}
