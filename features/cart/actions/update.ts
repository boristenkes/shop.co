'use server'

import { SessionCartItem } from '@/context/cart'
import { db } from '@/db'
import { cartItems } from '@/db/schema'
import { CartItem, carts } from '@/db/schema/carts'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { editCartItemSchema, sessionCartItemSchema } from '../zod'
import { NewItemData } from './create'

export async function updateCartItem(
	itemId: CartItem['id'],
	newData: Partial<NewItemData>
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		itemId = Number(itemId)

		if (!itemId) throw new Error('Invalid data')

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['update:own'])
		)
			throw new Error('Unauthorized')

		if (newData.quantity) newData.quantity = Math.min(newData.quantity, 20)

		const parsed = editCartItemSchema.parse(newData)

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

		await db.update(cartItems).set(parsed).where(eq(cartItems.id, itemId))

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_CART_ITEM]:', error)
		return { success: false }
	}
}

export async function syncUserCart(sessionCartItems: SessionCartItem[]) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['update:own'])
		)
			throw new Error('Unauthorized')

		const parsed = sessionCartItemSchema.array().parse(sessionCartItems)

		await db.transaction(async tx => {
			const activeCart = await db.query.carts.findFirst({
				where: eq(carts.userId, currentUser.id),
				columns: { id: true }
			})

			let cartId: number

			if (!activeCart) {
				const [newCart] = await tx
					.insert(carts)
					.values({ userId: currentUser.id })
					.returning({ id: carts.id })

				cartId = newCart.id
			} else {
				cartId = activeCart.id
			}

			await tx
				.insert(cartItems)
				.values(
					parsed.map(item => ({
						productId: item.product.id,
						colorId: item.color.id,
						quantity: item.quantity,
						size: item.size,
						cartId
					}))
				)
				.onConflictDoNothing() // TODO: use `.onConflictDoUpdate` instead to update sum quantities
		})

		return { success: true }
	} catch (error) {
		console.error('[SYNC_USER_CART]:', error)
		return { success: false }
	}
}
