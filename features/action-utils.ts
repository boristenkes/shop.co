'use server'

import { db } from '@/db'
import { orders, products, reviews, users } from '@/db/schema'
import { OrderStatus, Role } from '@/db/schema/enums'
import { auth } from '@/lib/auth'
import { Action, Entity, hasPermission } from '@/lib/permissions'
import { count, eq, isNull, sum } from 'drizzle-orm'

export async function requirePermission(entity: Entity, actions: Action[]) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, entity, actions))
		throw new Error('Unauthorized')
}

type StatisticsResults = [
	{ count: number },
	{ count: number },
	{ count: number },
	{ total: string | null }
]

type GetStatisticsReturn =
	| {
			success: true
			results: StatisticsResults
	  }
	| { success: false; message: string }

export async function getStatistics(): Promise<GetStatisticsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !['admin', 'moderator'].includes(currentUser.role!))
			throw new Error('Unauthorized')

		const countProducts = db
			.select({ count: count() })
			.from(products)
			.where(isNull(products.deletedAt))

		const countUsers = db
			.select({ count: count() })
			.from(users)
			.where(eq(users.role, Role.CUSTOMER))

		const countReviews = db
			.select({ count: count() })
			.from(reviews)
			.where(eq(reviews.approved, true))

		const getTotalRevenueInCents = db
			.select({ total: sum(orders.totalPriceInCents) })
			.from(orders)
			.where(eq(orders.status, OrderStatus.DELIVERED))

		const results = (await Promise.all([
			countProducts,
			countUsers,
			countReviews,
			getTotalRevenueInCents
		]).then(res => res.flat())) as StatisticsResults

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
