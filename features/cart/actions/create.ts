'use server'

import { db } from '@/db'
import { cartItems, carts } from '@/db/schema'
import { Size, TSize } from '@/db/schema/enums'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { touchCart } from '@/utils/actions'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export type NewItemData = {
	colorId: number
	size: TSize
	quantity: number
	productId: number
	productPriceInCents: number
}

const productPageFormSchema = z.object({
	colorId: z.coerce.number().int().positive().finite(),
	size: z.nativeEnum(Size),
	quantity: z.coerce.number().int().positive().lte(20),
	productId: z.coerce.number().int().positive().finite(),
	productPriceInCents: z.coerce.number().int().positive().finite()
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
				await touchCart(cartId) // Update cart `updatedAt`
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
