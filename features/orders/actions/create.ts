'use server'

import { db } from '@/db'
import { carts } from '@/db/schema'
import { Coupon } from '@/db/schema/coupons'
import { validateCoupon } from '@/features/coupon/actions/read'
import { orderItemSchema } from '@/features/orders/zod'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { stripe } from '@/lib/stripe'
import { StripeCheckoutSession } from '@stripe/stripe-js'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export type CheckoutReturn =
	| { success: true; sessionId: StripeCheckoutSession['id'] }
	| { success: false }

export async function checkout(): Promise<CheckoutReturn> {
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
					columns: { size: true, quantity: true, productPriceInCents: true },
					with: {
						product: {
							columns: {
								name: true
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
		const totalValue = orderItems.reduce(
			(acc, curr) => acc + curr.productPriceInCents * curr.quantity,
			0
		)

		const userCoupon = (await cookies()).get('coupon')
		let coupon: Pick<Coupon, 'id' | 'stripePromoCodeId'> | undefined

		if (userCoupon) {
			const couponValidation = await validateCoupon(
				userCoupon.value,
				totalValue
			)

			if (couponValidation.success) {
				coupon = {
					id: couponValidation.coupon.id,
					stripePromoCodeId: couponValidation.coupon.stripePromoCodeId
				}
			}
		}

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
					unit_amount: item.productPriceInCents
				},
				quantity: item.quantity
			})),
			discounts: coupon ? [{ promotion_code: coupon.stripePromoCodeId }] : [],
			metadata: {
				cartId: userCart.id,
				userId: currentUser.id,
				couponId: coupon?.id ?? null
			},
			shipping_address_collection: {
				allowed_countries: [
					'US',
					'CA',
					'GB',
					'DE',
					'FR',
					'AU',
					'IT',
					'ES',
					'NL',
					'JP',
					'RS'
				]
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
