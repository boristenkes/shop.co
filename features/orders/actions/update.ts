'use server'

import { db } from '@/db'
import { Order, orders } from '@/db/schema/orders'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'

export async function updateOrder(
	orderId: Order['id'],
	newData: Partial<Order>
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'orders', ['update']))
			throw new Error('Unauthorized')

		await db.update(orders).set(newData).where(eq(orders.id, orderId))

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_ERROR]:', error)
		return { success: false }
	}
}
