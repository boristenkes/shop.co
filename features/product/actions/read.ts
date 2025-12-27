'use server'

import { db } from '@/db'
import { products } from '@/db/schema'
import { Category } from '@/db/schema/categories'
import { Color } from '@/db/schema/colors'
import { ProductFAQ } from '@/db/schema/product-faqs'
import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { ProductToColor } from '@/db/schema/products-to-colors'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { sanitizeHTML } from '@/lib/sanitize'
import { requirePermission } from '@/utils/actions'
import {
	and,
	desc,
	eq,
	ilike,
	isNull,
	max,
	min,
	ne,
	or,
	sql
} from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ProductCard } from '../types'

export type ProductsReturn = Product & {
	category: Pick<Category, 'name'>
	images: Pick<ProductImage, 'url'>[]
	productsToColors: (ProductToColor & { color: Color })[]
	user: Pick<User, 'id' | 'name' | 'image' | 'email'>
}

export type GetProductsForAdminReturn =
	| { success: true; products: ProductsReturn[] }
	| { success: false; message: string }

export async function getProductsForAdmin(): Promise<GetProductsForAdminReturn> {
	try {
		await requirePermission('products', ['read'])

		const results = (await db.query.products.findMany({
			where: (products, { isNull }) => isNull(products.deletedAt),
			with: {
				category: {
					columns: { name: true }
				},
				images: {
					columns: { url: true },
					limit: 1
				},
				productsToColors: {
					with: { color: true }
				},
				user: {
					columns: {
						id: true,
						image: true,
						name: true,
						email: true
					}
				}
			},
			orderBy: desc(products.id)
		})) as ProductsReturn[]

		return { success: true, products: results }
	} catch (error) {
		console.error('[GET_PRODUCTS_FOR_ADMIN]:', error)
		return {
			success: false,
			message:
				'Something went wrong while trying to get products. Please try again later'
		}
	}
}

export type GetProductByIdProduct = Product & {
	productsToColors: { color: Color }[]
	averageRating: number
	images: Pick<ProductImage, 'id' | 'url'>[]
	category: Category | null
}

export type GetProductByIdReturn =
	| { success: true; product: GetProductByIdProduct }
	| { success: false; message: string }

export async function getProductById(
	id: Product['id']
): Promise<GetProductByIdReturn> {
	try {
		const product = await db.query.products.findFirst({
			where: (products, { isNull }) =>
				and(
					eq(products.id, id),
					isNull(products.deletedAt),
					eq(products.archived, false)
				),

			with: {
				images: { columns: { id: true, url: true } },
				productsToColors: {
					with: { color: true },
					columns: {}
				},
				category: true
			},
			extras: {
				averageRating: sql<number>`(
				  SELECT COALESCE(AVG(r.rating), 0) ::float
				  FROM shopco__reviews r
				  WHERE r.product_id = ${id}
				)`.as('average_rating')
			}
		})

		if (!product) throw new Error('Product not found.')

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_BY_ID]:', error)
		return { success: false, message: 'Product not found or it was deleted' }
	}
}

export type GetProductByIdForAdminProduct = GetProductByIdProduct & {
	totalSoldCount: number
	faqs: ProductFAQ[]
}

export type GetProductByIdForAdminReturn =
	| { success: true; product: GetProductByIdForAdminProduct }
	| { success: false; message: string }

export async function getProductByIdForAdmin(
	id: Product['id']
): Promise<GetProductByIdForAdminReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!['admin', 'moderator', 'admin:demo'].includes(currentUser.role)
		)
			throw new Error('Unauthorized')

		const product = await db.query.products.findFirst({
			where: eq(products.id, id),
			with: {
				images: { columns: { id: true, url: true } },
				productsToColors: {
					with: { color: true },
					columns: {}
				},
				category: true,
				faqs: true
			},
			extras: {
				averageRating: sql<number>`(
          SELECT COALESCE(AVG(r.rating), 0) ::float
          FROM shopco__reviews r
          WHERE r.product_id = ${id}
        )`.as('average_rating'),
				totalSoldCount: sql<number>`(
					SELECT COALESCE(SUM(quantity)::int, 0)
					FROM order_items
					WHERE product_id = ${id}
				)`.as('total_sold_count')
			}
		})

		if (!product) throw new Error('Product not found.')

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_BY_ID]:', error)
		return { success: false, message: 'Product not found or it was deleted' }
	}
}

export type GetProductDescriptionReturn =
	| { success: true; product: Pick<Product, 'detailsHTML'> }
	| { success: false }

export async function getProductDescription(
	productId: Product['id']
): Promise<GetProductDescriptionReturn> {
	try {
		const product = await db.query.products.findFirst({
			where: (product, { eq }) => eq(product.id, Number(productId)),
			columns: { detailsHTML: true }
		})

		if (!product) {
			console.warn(`Product with ID ${productId} not found`)
			notFound()
		}

		if (product.detailsHTML) {
			product.detailsHTML = sanitizeHTML(product.detailsHTML)
		}

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_DESCRIPTION]:', error)
		return { success: false }
	}
}

export async function getDeletedProducts(): Promise<GetProductsForAdminReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			(!hasPermission(currentUser.role, 'products', ['delete']) &&
				currentUser.role !== 'admin:demo')
		)
			throw new Error('Unauthorized')

		const results = (await db.query.products.findMany({
			where: (products, { isNotNull }) => isNotNull(products.deletedAt),
			with: {
				category: {
					columns: { name: true }
				},
				images: {
					columns: { url: true },
					limit: 1
				},
				productsToColors: {
					with: { color: true }
				},
				user: {
					columns: {
						id: true,
						image: true,
						name: true
					}
				}
			}
		})) as ProductsReturn[]

		return { success: true, products: results }
	} catch (error) {
		console.error('[GET_DELETED_PRODUCTS]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later'
		}
	}
}

export type GetProductsReturn =
	| { success: true; products: ProductCard[] }
	| { success: false; message: string }

export type GetProductsProps = {
	orderBy?: 'asc' | 'desc'
	page?: number
	pageSize?: number
}

export async function getProducts({
	orderBy = 'desc',
	page = 1,
	pageSize = 4
}: GetProductsProps = {}): Promise<GetProductsReturn> {
	try {
		const results = await db.query.products.findMany({
			where: (products, { isNull }) =>
				and(isNull(products.deletedAt), eq(products.archived, false)),
			orderBy: (products, { ...conf }) => [conf[orderBy](products.createdAt)],
			columns: {
				discount: true,
				name: true,
				priceInCents: true,
				slug: true,
				id: true
			},
			with: {
				images: {
					columns: { url: true },
					limit: 1,
					orderBy: (images, { asc }) => asc(images.id)
				}
			},
			extras: {
				averageRating: sql<number>`(
          SELECT COALESCE(AVG(r.rating), 0) ::float
          FROM shopco__reviews r
          WHERE r.product_id = ${products.id}
        )`.as('average_rating')
			},
			offset: (page - 1) * pageSize,
			limit: pageSize
		})

		return { success: true, products: results }
	} catch (error) {
		console.error('[GET_PRODUCTS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while getting products. Please try again later.'
		}
	}
}

type GetFeaturedProductsProps = GetProductsProps

export async function getFeaturedProducts({
	page = 1,
	pageSize = 4,
	orderBy = 'desc'
}: GetFeaturedProductsProps = {}): Promise<GetProductsReturn> {
	try {
		const results = await db.query.products.findMany({
			where: (products, { isNull }) =>
				and(
					eq(products.featured, true),
					isNull(products.deletedAt),
					eq(products.archived, false)
				),
			orderBy: (products, { ...conf }) => [conf[orderBy](products.createdAt)],
			columns: {
				discount: true,
				name: true,
				priceInCents: true,
				slug: true,
				id: true
			},
			with: {
				images: {
					columns: { url: true },
					limit: 1,
					orderBy: (images, { asc }) => asc(images.id)
				}
			},
			extras: {
				averageRating: sql<number>`(
          SELECT COALESCE(AVG(r.rating), 0) ::float
          FROM shopco__reviews r
          WHERE r.product_id = ${products.id}
        )`.as('average_rating')
			},
			offset: (page - 1) * pageSize,
			limit: pageSize
		})

		return { success: true, products: results }
	} catch (error) {
		console.error('[GET_FEATURED_PRODUCTS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while getting products. Please try again later.'
		}
	}
}

type GetRelatedProductsProps = GetProductsProps

export async function getRelatedProducts(
	productId: Product['id'],
	{ page = 1, pageSize = 4, orderBy = 'desc' }: GetRelatedProductsProps = {}
): Promise<GetProductsReturn> {
	try {
		const targetProduct = await db.query.products.findFirst({
			where: and(
				eq(products.id, productId),
				isNull(products.deletedAt),
				eq(products.archived, false)
			),
			columns: {
				id: true,
				priceInCents: true,
				categoryId: true
			}
		})

		if (!targetProduct) {
			console.error(`Product with ID ${productId} not found`)
			return { success: false, message: 'Product not found' }
		}

		// const [minPrice, maxPrice] = [
		// 	Math.floor(targetProduct.priceInCents * 0.8),
		// 	Math.ceil(targetProduct.priceInCents * 1.2)
		// ]

		const results = await db.query.products.findMany({
			where: and(
				eq(products.categoryId, targetProduct.categoryId!), // Same category
				ne(products.id, targetProduct.id), // Exclude the current product
				// between(products.priceInCents, minPrice, maxPrice), // 80% <= Price <= 120%
				isNull(products.deletedAt), // Isn't deleted
				eq(products.archived, false) // Isn't archived
			),
			orderBy: (products, { ...conf }) => [conf[orderBy](products.createdAt)],
			columns: {
				discount: true,
				name: true,
				priceInCents: true,
				slug: true,
				id: true
			},
			with: {
				images: {
					columns: { url: true },
					limit: 1,
					orderBy: (images, { asc }) => asc(images.id)
				}
			},
			extras: {
				averageRating: sql<number>`(
          SELECT COALESCE(AVG(r.rating), 0) ::float
          FROM shopco__reviews r
          WHERE r.product_id = ${products.id}
        )`.as('average_rating')
			},
			offset: (page - 1) * pageSize,
			limit: pageSize
		})

		return { success: true, products: results }
	} catch (error) {
		console.error('[GET_RELATED_PRODUCTS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while getting related products. Please try again later.'
		}
	}
}

type SearchProductsReturn =
	| { success: true; products: ProductCard[] }
	| { success: false }

export async function searchProducts(
	query: string,
	{ limit }: { limit?: number } = {}
): Promise<SearchProductsReturn> {
	try {
		if (!query?.length) return { success: true, products: [] }

		const results = await db.query.products.findMany({
			where: or(
				ilike(products.name, `%${query}%`),
				ilike(products.description, `%${query}%`)
			),
			columns: {
				discount: true,
				name: true,
				priceInCents: true,
				slug: true,
				id: true
			},
			with: {
				images: {
					columns: { url: true },
					limit: 1,
					orderBy: (images, { asc }) => asc(images.id)
				}
			},
			extras: {
				averageRating: sql<number>`(
				SELECT COALESCE(AVG(r.rating), 0) ::float
				FROM shopco__reviews r
				WHERE r.product_id = ${products.id}
			)`.as('average_rating')
			},
			limit
			// offset: (page - 1) * pageSize,
		})

		return { success: true, products: results }
	} catch (error) {
		console.error('[SEARCH_PRODUCTS]:', error)
		return { success: false }
	}
}

type GetProductPriceMinMaxReturn =
	| { success: true; minmax: { min: number; max: number } }
	| { success: false }

export async function getProductPriceMinMax(): Promise<GetProductPriceMinMaxReturn> {
	try {
		const [minmax] = (await db
			.select({
				min: min(products.priceInCents),
				max: max(products.priceInCents)
			})
			.from(products)) as { min: number; max: number }[]

		return { success: true, minmax }
	} catch (error) {
		console.error('[GET_PRODUCT_PRICE_MINMAX]:', error)
		return { success: false }
	}
}
