'use server'

import { db } from '@/db'
import { cartItems } from '@/db/schema'
import { Cart, CartItem, carts } from '@/db/schema/carts'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { touchCart } from '@/utils/actions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

		const [deletedCartItem] = await db
			.delete(cartItems)
			.where(eq(cartItems.id, itemId))
			.returning({
				cartId: cartItems.cartId
			})

		await touchCart(deletedCartItem.cartId)

		return { success: true, itemId }
	} catch (error) {
		console.error('[DELETE_CART_ITEM]:', error)
		return { success: false }
	}
}

export type DeleteCartReturn =
	| { success: true }
	| { success: false; message?: string }

export async function deleteCart(
	cartId: Cart['id'],
	{ path = '/dashboard/carts' } = {}
): Promise<DeleteCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		if (!hasPermission(currentUser.role, 'carts', ['delete'])) {
			const cart = await db.query.carts.findFirst({
				where: eq(carts.id, cartId),
				columns: { userId: true }
			})

			if (!cart) return { success: false, message: 'Cart not found' }

			if (
				currentUser.id === cart.userId &&
				!hasPermission(currentUser.role, 'carts', ['delete:own'])
			)
				throw new Error('Unauthorized')
		}

		await db.delete(carts).where(eq(carts.id, cartId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_CART]:', error)
		return { success: false }
	}
}
