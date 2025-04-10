'use server'

import { SessionCartItem } from '@/context/cart'
import { db } from '@/db'
import { cartItems, carts } from '@/db/schema'
import { CartItem } from '@/db/schema/carts'
import { Size, TSize } from '@/db/schema/enums'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export type NewItemData = {
	colorId: number
	size: TSize
	quantity: number
	productId: number
}

const productPageFormSchema = z.object({
	colorId: z.coerce.number().int().positive().finite(),
	size: z.nativeEnum(Size),
	quantity: z.coerce.number().int().positive().lte(20),
	productId: z.coerce.number().int().positive().finite()
})

export type AddToCartReturn = { success: boolean }

export async function saveToCart(data: NewItemData): Promise<AddToCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['create', 'update:own'])
		)
			throw new Error('Unauthorized')

		const parsed = productPageFormSchema.parse(data)

		await db.transaction(async tx => {
			// Check if the user has an active cart
			const activeCart = await tx.query.carts.findFirst({
				where: eq(carts.userId, currentUser.id),
				columns: { id: true }
			})

			let cartId: number

			// Create a new cart if none exists
			if (!activeCart) {
				const [newCart] = await tx
					.insert(carts)
					.values({ userId: currentUser.id })
					.returning({ id: carts.id })

				if (!newCart) tx.rollback()

				cartId = newCart.id
			} else {
				cartId = activeCart.id
			}

			// Add the cart item
			await tx.insert(cartItems).values({ cartId, ...parsed })
		})

		return { success: true }
	} catch (error) {
		console.error('[SAVE_TO_CART]:', error)
		return { success: false }
	}
}

export async function saveItemsToCart(
	items: NewItemData[] | SessionCartItem[]
): Promise<AddToCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['create', 'create'])
		)
			throw new Error('Unauthorized')

		const parsed = items.map(item => productPageFormSchema.parse(item))

		await db.transaction(async tx => {
			// Check if the user has an active cart
			const activeCart = await tx.query.carts.findFirst({
				where: eq(carts.userId, currentUser.id),
				columns: { id: true }
			})

			let cartId: number

			// Create a new cart if none exists
			if (!activeCart) {
				const [newCart] = await tx
					.insert(carts)
					.values({ userId: currentUser.id })
					.returning({ id: carts.id })

				if (!newCart) tx.rollback()

				cartId = newCart.id
			} else {
				cartId = activeCart.id
			}

			// Add the cart item
			await tx
				.insert(cartItems)
				.values(parsed.map(item => ({ ...item, cartId })))
		})

		return { success: true }
	} catch (error) {
		console.error('[SAVE_ITEMS_TO_CART]', error)
		return { success: false }
	}
}

export type GetUserCartItemsReturn =
	| { success: true; items: SessionCartItem[] }
	| { success: false; message: string }

export async function getUserCartItems(
	userId: User['id']
): Promise<GetUserCartItemsReturn> {
	try {
		if (!userId) throw new Error('Invalid data')

		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'carts', ['read:own']))
			throw new Error('Unauthorized')

		const cart = await db.query.carts.findFirst({
			where: eq(carts.userId, userId),
			columns: {},
			with: {
				cartItems: {
					columns: {
						id: true,
						quantity: true,
						size: true
					},
					with: {
						color: true,
						product: {
							columns: {
								id: true,
								name: true,
								slug: true,
								priceInCents: true,
								discount: true,
								stock: true
							},
							with: {
								images: {
									columns: {
										url: true
									},
									limit: 1
								}
							}
						}
					}
				}
			}
		})

		const items = cart ? cart.cartItems : ([] as SessionCartItem[])

		items.forEach(item => {
			item.product.image = item.product.images[0].url
			delete item.product.images
		})

		return { success: true, items: items as SessionCartItem[] }
	} catch (error) {
		console.error('[GET_USER_CART_ITEMS]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}

export async function updateCartItem(
	itemId: CartItem['id'],
	newData: Partial<NewItemData>
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'carts', ['update:own'])
		)
			throw new Error('Unauthorized')

		const parsed = productPageFormSchema.parse(newData)

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
		console.error('[UPATE_CART_ITEM]:', error)
		return { success: false }
	}
}

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
