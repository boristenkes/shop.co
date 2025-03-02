'use server'

import { db } from '@/db'
import { ProductImage } from '@/db/schema/product-images'
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
				),
				columns: {}
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
> & { user: Pick<User, 'id' | 'name'> }

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
				columns: { id: true, name: true }
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
	user: Pick<User, 'id' | 'name' | 'email' | 'image'>
	product: Pick<Product, 'id' | 'name' | 'slug'> & {
		images: Pick<ProductImage, 'url'>[]
	}
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
						email: true,
						image: true
					}
				},
				product: {
					columns: {
						id: true,
						name: true,
						slug: true
					},
					with: {
						images: {
							columns: { url: true },
							limit: 1
						}
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

export type GetUserReviewsReview = Pick<
	Review,
	'id' | 'approved' | 'comment' | 'rating' | 'createdAt'
> & {
	product: Pick<Product, 'id' | 'name' | 'slug'> & {
		images: { url: ProductImage['url'] }[]
	}
}

export type GetUserReviewsReturn =
	| { success: true; reviews: GetUserReviewsReview[] }
	| { success: false }

export async function getUserReviews(
	userId: User['id']
): Promise<GetUserReviewsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'reviews', [
				currentUser.id !== userId ? 'read' : 'read:own'
			])
		)
			throw new Error('Unauthorized')

		const reviews = await db.query.reviews.findMany({
			where: (review, { eq }) => eq(review.userId, userId),
			columns: {
				id: true,
				approved: true,
				comment: true,
				rating: true,
				createdAt: true
			},
			with: {
				product: {
					columns: {
						id: true,
						name: true,
						slug: true
					},
					with: {
						images: {
							columns: { url: true },
							limit: 1
						}
					}
				}
			},
			orderBy: (review, { desc }) => desc(review.createdAt)
		})

		return { success: true, reviews }
	} catch (error) {
		console.error('[GET_USER_REVIEWS]:', error)
		return { success: false }
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
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		if (!hasPermission(currentUser.role, 'reviews', ['delete'])) {
			const targetReview = await db.query.reviews.findFirst({
				where: eq(reviews.id, reviewId),
				columns: {},
				with: {
					user: {
						columns: { id: true }
					}
				}
			})

			if (
				targetReview?.user.id === currentUser.id &&
				!hasPermission(currentUser.role, 'reviews', ['delete:own'])
			)
				throw new Error('Unauthorized')
		}

		await db.delete(reviews).where(eq(reviews.id, reviewId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_REVIEW]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}
