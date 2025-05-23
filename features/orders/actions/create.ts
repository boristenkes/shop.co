'use server'

import { SessionCartItem } from '@/context/cart'
import { db } from '@/db'
import { carts } from '@/db/schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { stripe } from '@/lib/stripe'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { StripeCheckoutSession } from '@stripe/stripe-js'
import { eq } from 'drizzle-orm'
import { orderItemSchema } from '../zod'

export type CheckoutReturn =
	| { success: true; sessionId: StripeCheckoutSession['id'] }
	| { success: false }

export async function checkout(
	items: SessionCartItem[]
): Promise<CheckoutReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'orders', ['create']))
			throw new Error('Unauthorized')

		const userCart = await db.query.carts.findFirst({
			where: eq(carts.userId, currentUser.id),
			columns: { id: true },
			with: {
				cartItems: {
					columns: { size: true, quantity: true },
					with: {
						product: {
							columns: {
								name: true,
								priceInCents: true,
								discount: true
							},
							with: {
								images: {
									columns: { url: true },
									limit: 1
								}
							}
						},
						color: {
							columns: {
								name: true
							}
						}
					}
				}
			}
		})

		if (!userCart) throw new Error('User cart not found')

		const userCartItems = userCart.cartItems.map(item => ({
			...item,
			product: {
				...item.product,
				image: item.product.images[0].url
			}
		}))

		const orderItems = orderItemSchema.array().parse(userCartItems)

		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: orderItems.map(item => ({
				price_data: {
					currency: 'usd',
					product_data: {
						name: item.product.name,
						images: [item.product.image],
						description: `${item.product.name}; size: ${item.size}; color: ${item.color.name}`
					},
					unit_amount: calculatePriceWithDiscount(
						item.product.priceInCents,
						item.product.discount ?? 0
					)
				},
				quantity: item.quantity
			})),
			metadata: {
				cartId: userCart.id,
				userId: currentUser.id
			},
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`
		})

		return { success: true, sessionId: stripeSession.id }
	} catch (error) {
		console.error('[CHECKOUT]:', error)
		return { success: false }
	}
}
