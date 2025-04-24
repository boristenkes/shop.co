'use server'

import { SessionCartItem } from '@/context/cart'
import { db } from '@/db'
import { carts } from '@/db/schema'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'

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
			return { success: true, items: [] }

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
			// @ts-expect-error
			item.product.image = item.product.images[0].url
			// @ts-expect-error
			delete item.product.images
		})

		return { success: true, items: items as SessionCartItem[] }
	} catch (error) {
		console.error('[GET_USER_CART_ITEMS]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}
