'use server'

import { db } from '@/db'
import { Color } from '@/db/schema/colors'
import { Order, OrderItem, orders } from '@/db/schema/orders'
import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'

export type GetUserOrdersOrder = Order & {
	orderItems: (OrderItem & {
		color: Color
		product: Pick<Product, 'id' | 'name' | 'slug'> & {
			images: Pick<ProductImage, 'url'>[]
		}
	})[]
}

export type GetUserOrdersReturn =
	| { success: true; orders: GetUserOrdersOrder[] }
	| { success: false; message?: string }

export async function getUserOrders(
	userId?: User['id']
): Promise<GetUserOrdersReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		const isOwnOrder = !userId || userId === currentUser.id
		const hasAccess = hasPermission(currentUser.role, 'orders', [
			isOwnOrder ? 'read:own' : 'read'
		])

		if (!hasAccess) throw new Error('Unauthorized')

		const orders = await db.query.orders.findMany({
			where: order => eq(order.userId, userId ?? currentUser.id),
			orderBy: (order, { desc }) => desc(order.createdAt),
			with: {
				orderItems: {
					with: {
						color: true,
						product: {
							columns: {
								id: true,
								name: true,
								slug: true
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

		return { success: true, orders }
	} catch (error) {
		console.error('[GET_USER_ORDERS]:', error)
		return { success: false }
	}
}

export type GetAllOrdersOrder = Order & {
	user: Pick<User, 'id' | 'name' | 'image' | 'email'>
}

export type GetAllOrdersReturn =
	| {
			success: true
			orders: GetAllOrdersOrder[]
	  }
	| { success: false; message?: string }

export async function getAllOrders(): Promise<GetAllOrdersReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'orders', ['read']))
			throw new Error('Unauthorized')

		const orders = await db.query.orders.findMany({
			orderBy: (order, { desc }) => desc(order.createdAt),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
						email: true
					}
				}
			}
		})

		return { success: true, orders }
	} catch (error) {
		console.error('[GET_ALL_ORDERS]:', error)
		return { success: false }
	}
}

export type GetOrderOrder = Order & {
	user: Pick<User, 'id' | 'name' | 'image' | 'createdAt'>
	orderItems: (Pick<
		OrderItem,
		'id' | 'productPriceInCents' | 'quantity' | 'size'
	> & {
		color: Color
		product: Pick<Product, 'id' | 'name' | 'slug'> & {
			images: Pick<ProductImage, 'url'>[]
		}
	})[]
}

export type GetOrderReturn =
	| { success: true; order: GetOrderOrder }
	| { success: false; message?: string }

export async function getOrder(orderId: Order['id']): Promise<GetOrderReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'orders', ['read']))
			throw new Error('Unauthorized')

		const order = await db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
						email: true,
						createdAt: true
					}
				},
				orderItems: {
					columns: {
						id: true,
						productPriceInCents: true,
						quantity: true,
						size: true
					},
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

		if (!order) return { success: false, message: 'Order not found' }

		return { success: true, order }
	} catch (error) {
		console.error('[GET_ORDER]:', error)
		return { success: false }
	}
}
