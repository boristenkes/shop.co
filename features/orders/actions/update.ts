'use server'

import { db } from '@/db'
import { Order, orders } from '@/db/schema/orders'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { updateOrderSchema } from '../zod'

export type UpdateOrderReturn =
	| { success: true }
	| { success: false; message?: string }

export async function updateOrder(
	orderId: Order['id'],
	newData: Partial<Order>,
	{ path }: { path?: string } = {}
): Promise<UpdateOrderReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		const validatedData = updateOrderSchema.parse(newData)

		// Admins can update any order
		if (hasPermission(currentUser.role, 'orders', ['update'])) {
			await db.update(orders).set(validatedData).where(eq(orders.id, orderId))

			if (path) revalidatePath(path)

			return { success: true }
		}

		if (!hasPermission(currentUser.role, 'orders', ['update:own']))
			throw new Error('Unauthorized')

		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			columns: { status: true, userId: true }
		})

		if (!order) {
			console.warn(`Order with ID ${orderId} not found`)
			return { success: false, message: 'Order not found' }
		}

		// Customer can only update status (to canceled)
		if (validatedData.status !== 'canceled') throw new Error('Unauthorized')

		// Customer can update only their own orders
		if (order.userId !== currentUser.id) throw new Error('Unauthorized')

		if (order.status !== 'pending') {
			return {
				success: false,
				message: 'You can only cancel orders that are pending.'
			}
		}

		await db
			.update(orders)
			.set({ status: validatedData.status })
			.where(eq(orders.id, orderId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_ERROR]:', error)
		return { success: false }
	}
}
