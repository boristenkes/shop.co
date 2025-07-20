'use server'

import { db } from '@/db'
import { Order, orders } from '@/db/schema/orders'
import { auth } from '@/lib/auth'
import { generateReceipt } from '@/lib/pdf'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import { updateOrderSchema } from '../zod'

const uploadthingApi = new UTApi()

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

export async function handleReceipt(orderId: Order['id']) {
	try {
		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			columns: {
				id: true,
				shippingAddress: true,
				totalPriceInCents: true,
				createdAt: true
			},
			with: {
				orderItems: {
					columns: { productPriceInCents: true, quantity: true, size: true },
					with: {
						product: { columns: { name: true } },
						color: { columns: { name: true } }
					}
				}
			}
		})

		if (!order) throw new Error(`Order ${orderId} not found`)

		const receiptFile = generateReceipt(order)

		const receipt = await uploadthingApi.uploadFiles(receiptFile)

		if (receipt.error)
			throw new Error(`Failed to upload receipt file: ${receipt.error}`)

		await db
			.update(orders)
			.set({ receiptUrl: receipt.data.url })
			.where(eq(orders.id, orderId))

		return { success: true }
	} catch (error) {
		console.error('[HANDLE_RECEIPT]:', error)
		return { success: false }
	}
}
