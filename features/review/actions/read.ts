'use server'

import { db } from '@/db'
import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { Review } from '@/db/schema/reviews'
import { User } from '@/db/schema/users'
import { requirePermission } from '@/features/action-utils'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

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
