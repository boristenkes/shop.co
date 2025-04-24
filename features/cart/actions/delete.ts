'use server'

import { db } from '@/db'
import { cartItems } from '@/db/schema'
import { CartItem } from '@/db/schema/carts'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'

export async function deleteCartItem(itemId: CartItem['id'] | string) {
	try {
		const session = await auth()
		const currentUser = session?.user

		itemId = Number(itemId)

		if (isNaN(itemId)) throw new Error('Invalid data')

		if (!currentUser) throw new Error('Unauthorized')

		if (!hasPermission(currentUser.role, 'carts', ['delete'])) {
			const targetCartItem = await db.query.cartItems.findFirst({
				where: eq(cartItems.id, itemId),
				with: {
					cart: {
						columns: { userId: true }
					}
				},
				columns: {}
			})

			if (targetCartItem?.cart.userId !== currentUser.id)
				throw new Error('Unauthorized')

			if (!hasPermission(currentUser.role, 'carts', ['delete:own']))
				throw new Error('Unauthorized')
		}

		await db.delete(cartItems).where(eq(cartItems.id, itemId))

		return { success: true, itemId }
	} catch (error) {
		console.error('[DELETE_CART_ITEM]:', error)
		return { success: false }
	}
}
