'use server'

import { db } from '@/db'
import { carts } from '@/db/schema'
import { Cart, CartItem } from '@/db/schema/carts'
import { Color } from '@/db/schema/colors'
import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { User } from '@/db/schema/users'
import { UserCartItemSchema } from '@/features/cart/zod'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq, sql } from 'drizzle-orm'

export type GetUserCartItemsReturn =
	| { success: true; items: UserCartItemSchema[] }
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
						size: true,
						productPriceInCents: true
					},
					with: {
						color: true,
						product: {
							columns: { id: true, name: true, slug: true, stock: true },
							with: { images: { columns: { url: true }, limit: 1 } }
						}
					}
				}
			}
		})

		const items = (cart
			? cart.cartItems
			: []) as unknown as UserCartItemSchema[]

		items.forEach(item => {
			// @ts-expect-error
			item.product.image = item.product.images[0].url
			// @ts-expect-error
			delete item.product.images
		})

		return { success: true, items }
	} catch (error) {
		console.error('[GET_USER_CART_ITEMS]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}

export type GetCartCart = Cart & {
	user: Pick<User, 'id' | 'name' | 'image' | 'email'>
	cartItems: (CartItem & {
		color: Color
		product: Pick<Product, 'id' | 'slug' | 'name'> & {
			images: Pick<ProductImage, 'url'>[]
		}
	})[]
}

export type GetCartReturn =
	| { success: true; cart: GetCartCart }
	| { success: false; message?: string }

export async function getCart(cartId: Cart['id']): Promise<GetCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'carts', ['read']))
			throw new Error('Unauthorized')

		const cart = await db.query.carts.findFirst({
			where: eq(carts.id, cartId),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
						email: true
					}
				},
				cartItems: {
					with: {
						color: true,
						product: {
							columns: {
								id: true,
								slug: true,
								name: true
							},
							with: {
								images: {
									columns: { url: true },
									limit: 1
								}
							}
						}
					}
				}
			}
		})

		if (!cart) return { success: false, message: 'Cart not found' }

		return { success: true, cart }
	} catch (error) {
		console.error('[GET_CART]:', error)
		return { success: false }
	}
}

export type GetAllCartsCart = Cart & {
	user: Pick<User, 'id' | 'name' | 'email' | 'image'>
	itemCount: number
}

export type GetAllCartsReturn =
	| { success: true; carts: GetAllCartsCart[] }
	| { success: false }

export async function getAllCarts(): Promise<GetAllCartsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'carts', ['read']))
			throw new Error('Unauthorized')

		const carts = await db.query.carts.findMany({
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						email: true,
						image: true
					}
				}
			},
			extras: {
				itemCount: sql<number>`(
					SELECT COUNT(*) 
					FROM cart_items 
					WHERE cart_items.cart_id = carts.id
				)`.as('item_count')
			},
			orderBy: (cart, { desc }) => desc(cart.id)
		})

		return { success: true, carts }
	} catch (error) {
		console.error('[GET_ALL_CARTS]:', error)
		return { success: false }
	}
}
