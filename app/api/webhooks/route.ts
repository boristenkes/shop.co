import { db } from '@/db'
import { carts, orderItems, orders, products } from '@/db/schema'
import { orderMetadataSchema } from '@/features/orders/zod'
import { stripe } from '@/lib/stripe'
import { eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
	const signature = req.headers.get('stripe-signature')!
	const body = await req.text()

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (error) {
		console.error('[WEBHOOK/CONSTRUCT_EVENT]:', error)
		return new NextResponse('Invalid signature', { status: 400 })
	}

	if (event.type === 'checkout.session.completed') {
		const checkoutSession = event.data.object as Stripe.Checkout.Session

		const metadata = orderMetadataSchema.safeParse(checkoutSession.metadata)

		if (!metadata.success)
			return new NextResponse('Invalid metadata', { status: 400 })

		// Update database
		try {
			await db.transaction(async tx => {
				const cartItems = await tx.query.cartItems.findMany({
					where: item => eq(item.cartId, metadata.data.cartId)
				})

				const rawShippingAddress =
					checkoutSession.collected_information?.shipping_details?.address!
				const shippingAddress = Object.values(rawShippingAddress)
					.filter(Boolean)
					.join(', ')

				const [order] = await tx
					.insert(orders)
					.values({
						userId: metadata.data.userId,
						shippingAddress,
						totalPriceInCents: Number(checkoutSession.amount_total),
						couponId: metadata.data.couponId
					})
					.returning({ id: orders.id })

				await tx.insert(orderItems).values(
					cartItems.map(item => ({
						orderId: order.id,
						colorId: item.colorId,
						productId: item.productId,
						productPriceInCents: item.productPriceInCents,
						quantity: item.quantity,
						size: item.size
					}))
				)

				// Update product quantities
				await tx.execute(sql`
					UPDATE ${products}
					SET stock = ${products.stock} - CAST(data.quantity AS INTEGER)
					FROM (
						VALUES ${sql.join(
							cartItems.map(
								item =>
									sql`(CAST(${item.productId} AS INTEGER), ${item.quantity})`
							),
							sql`, `
						)}
					) AS data(id, quantity)
					WHERE ${products}.id = data.id
				`)

				await tx.delete(carts).where(eq(carts.id, metadata.data.cartId))
			})
		} catch (error) {
			console.error('[WEBHOOK/TRANSACTION]:', error)
			return new NextResponse('Something went wrong', { status: 500 })
		}
	}

	return new NextResponse('Success', { status: 200 })
}
