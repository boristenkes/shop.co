'use server'

import { db } from '@/db'
import { cartItems, carts } from '@/db/schema'
import { auth } from '@/lib/auth'
import { sizes } from '@/lib/enums'
import { hasPermission } from '@/lib/permissions'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { touchCart } from '@/utils/actions'
import { integerSchema } from '@/utils/zod'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const productPageFormSchema = z.object({
	colorId: integerSchema,
	size: z.enum(sizes),
	quantity: integerSchema.positive().lte(20),
	productId: integerSchema
})

export type NewItemData = z.infer<typeof productPageFormSchema>

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
				await touchCart(cartId) // Update cart `updatedAt`
			}

			const product = await db.query.products.findFirst({
				where: (product, { eq }) => eq(product.id, parsed.productId),
				columns: { priceInCents: true, discount: true }
			})

			if (!product) throw new Error('Product not found')

			const productPriceInCents = calculatePriceWithDiscount(
				product.priceInCents,
				product.discount
			)

			// Add the cart item
			await tx
				.insert(cartItems)
				.values({ cartId, productPriceInCents, ...parsed })
		})

		return { success: true }
	} catch (error) {
		console.error('[SAVE_TO_CART]:', error)
		return { success: false }
	}
}
