'use server'

import { LocalCartItem } from '@/context/cart'
import { db } from '@/db'
import { cartItems, carts, colors, products } from '@/db/schema'
import { Color } from '@/db/schema/colors.schema'
import { Size, TSize } from '@/db/schema/enums'
import { ProductImage } from '@/db/schema/product-images.schema'
import { Product } from '@/db/schema/products.schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { isArray } from '@/lib/utils'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { z } from 'zod'

export type NewItemData = {
	colorId: number
	size: TSize
	quantity: number
	currentUserId?: number
	productId: number
}

const productPageFormSchema = z.object({
	colorId: z.coerce.number().int().positive().finite(),
	size: z.nativeEnum(Size),
	quantity: z.coerce.number().int().positive().lte(20),
	productId: z.coerce.number().int().positive().finite()
})

export type AddToCartReturn =
	| { success: true }
	| { success: false; message: string }

export async function saveToCart(
	data: NewItemData | NewItemData[]
): Promise<AddToCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role!, 'carts', ['create', 'update:own'])
		)
			throw new Error('Unauthorized')

		const parsed = isArray(data)
			? data.map(item => productPageFormSchema.parse(item))
			: productPageFormSchema.parse(data)

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
				// @ts-expect-error TS doesn't know `insert` also accepts array of rows
				.values(
					isArray(parsed)
						? parsed.map(item => ({ cartId, ...item }))
						: { cartId, ...parsed }
				)
		})

		return { success: true }
	} catch (error) {
		console.error('[ADD_TO_CART]:', error)
		return { success: false, message: 'Something went wrong.' }
	}
}

export async function saveItemsToCart(
	items: NewItemData[]
): Promise<AddToCartReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role!, 'carts', ['create', 'create'])
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
		return { success: false, message: 'Something went wrong.' }
	}
}

type PopulatedCartProduct = Pick<
	Product,
	'name' | 'slug' | 'priceInCents' | 'discount' | 'slug'
>
type PopulateLocalCartItem =
	| (PopulatedCartProduct & {
			images: Pick<ProductImage, 'url'>[]
			color: Pick<Color, 'name' | 'hexCode'>
	  })
	| undefined

type PopulateLocalCartItemsReturn =
	| { success: true; items: PopulateLocalCartItem[] }
	| { success: false; message: string }

export async function populateLocalCartItems(
	items: LocalCartItem[]
): Promise<PopulateLocalCartItemsReturn> {
	try {
		const productIds: number[] = []
		const colorIds: number[] = []

		items.forEach(item => {
			productIds.push(item.productId)
			colorIds.push(item.colorId)
		})

		const getProducts = db.query.products.findMany({
			where: and(
				inArray(products.id, productIds),
				isNull(products.deletedAt),
				eq(products.archived, false)
			),
			columns: {
				priceInCents: true,
				discount: true,
				name: true,
				slug: true,
				stock: true
			},
			with: {
				images: { columns: { url: true }, limit: 1 }
			},
			orderBy: products.id
		})

		const getColors = db.query.colors.findMany({
			where: inArray(colors.id, colorIds),
			columns: {
				name: true,
				hexCode: true
			}
		})

		const [cartProductItems, cartColorItems] = await Promise.all([
			getProducts,
			getColors
		])

		const merged = cartProductItems.map((item, idx) =>
			item
				? {
						...item,
						color: cartColorItems[idx]
				  }
				: undefined
		)

		return { success: true, items: merged }
	} catch (error) {
		console.error('[POPULATE_LOCAL_CART_ITEMS]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later'
		}
	}
}
