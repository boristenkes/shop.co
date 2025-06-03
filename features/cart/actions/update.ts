'use server'

import { db } from '@/db'
import { cartItems } from '@/db/schema'
import { CartItem, carts } from '@/db/schema/carts'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { touchCart } from '@/utils/actions'
import { eq, sql } from 'drizzle-orm'
import {
	editCartItemSchema,
	userCartItemSchema,
	UserCartItemSchema
} from '../zod'
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

		const [updatedCartItem] = await db
			.update(cartItems)
			.set(parsed)
			.where(eq(cartItems.id, itemId))
			.returning({
				cartId: cartItems.cartId
			})

		await touchCart(updatedCartItem.cartId)

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_CART_ITEM]:', error)
		return { success: false }
	}
}

export async function syncUserCart(guestCartItems: UserCartItemSchema[]) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['update:own'])
		)
			throw new Error('Unauthorized')

		const parsed = userCartItemSchema.array().parse(guestCartItems)

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

			const productIds = guestCartItems.map(item => item.product.id)

			const products = await tx.query.products.findMany({
				where: (product, { inArray }) => inArray(product.id, productIds),
				columns: { id: true, priceInCents: true, discount: true }
			})

			const productPrices = products.reduce<ProductPrices>((acc, curr) => {
				acc[curr.id] = {
					priceInCents: curr.priceInCents,
					discount: curr.discount
				}
				return acc
			}, {})

			const itemsToInsert = parsed.map(item => {
				const { priceInCents, discount } = productPrices[item.product.id]

				return {
					productId: item.product.id,
					colorId: item.color.id,
					quantity: item.quantity,
					size: item.size,
					productPriceInCents: calculatePriceWithDiscount(
						priceInCents,
						discount
					),
					cartId
				}
			})

			await tx
				.insert(cartItems)
				.values(itemsToInsert)
				.onConflictDoUpdate({
					target: [
						cartItems.cartId,
						cartItems.productId,
						cartItems.size,
						cartItems.colorId
					],
					set: {
						quantity: sql`LEAST(excluded.quantity, 20)`
					}
				})
		})

		return { success: true }
	} catch (error) {
		console.error('[SYNC_USER_CART]:', error)
		return { success: false }
	}
}

type ProductPrices = Record<
	number,
	{ priceInCents: number; discount: number | null }
>
