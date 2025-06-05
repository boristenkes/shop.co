'use server'

import { db } from '@/db'
import { orders, products, reviews, users } from '@/db/schema'
import { Cart, carts } from '@/db/schema/carts'
import { auth } from '@/lib/auth'
import { Action, Entity, hasPermission } from '@/lib/permissions'
import { eq, isNull, sum } from 'drizzle-orm'

export async function requirePermission(entity: Entity, actions: Action[]) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, entity, actions))
		throw new Error('Unauthorized')
}

type StatisticsResults = {
	productCount: number
	userCount: number
	reviewCount: number
	totalRevenue: number
}

type GetStatisticsReturn =
	| { success: true; results: StatisticsResults }
	| { success: false; message: string }

export async function getStatistics(): Promise<GetStatisticsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!['admin', 'moderator', 'admin:demo'].includes(currentUser.role)
		)
			throw new Error('Unauthorized')

		const countProducts = db.$count(products, isNull(products.deletedAt))
		const countUsers = db.$count(users, eq(users.role, 'customer'))
		const countReviews = db.$count(reviews, eq(reviews.approved, true))

		const getTotalRevenueInCents = db
			.select({ total: sum(orders.totalPriceInCents) })
			.from(orders)
			.where(eq(orders.status, 'delivered'))
			.then(res => res[0].total)

		const responses = await Promise.all([
			countProducts,
			countUsers,
			countReviews,
			getTotalRevenueInCents
		]).then(res => res.flat())

		const [productCount, userCount, reviewCount, totalRevenue] = responses
		const results = {
			productCount,
			userCount,
			reviewCount,
			totalRevenue
		} as StatisticsResults

		return { success: true, results }
	} catch (error) {
		console.error('[GET_STATISTICS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while getting statistics. Please try again later.'
		}
	}
}

export async function touchCart(cartId: Cart['id']) {
	await db
		.update(carts)
		.set({ updatedAt: new Date() })
		.where(eq(carts.id, cartId))
}
