'use server'

import { db } from '@/db'
import { products, productsToColors } from '@/db/schema'
import { categories, Category } from '@/db/schema/categories'
import { Color, colors } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { isArray, toCents } from '@/lib/utils'
import {
	and,
	arrayOverlaps,
	asc,
	between,
	desc,
	eq,
	exists,
	gte,
	inArray,
	isNull,
	lte,
	sql
} from 'drizzle-orm'
import { ProductCard } from '../types'

export type ProductFilters = {
	min: number
	max: number
	color: Color['slug'][]
	size: TSize[]
	category: Category['slug'][]
	sortby: string
}

export type FetchProductsOptions = {
	page?: number
	pageSize?: number
}

export type FilterProductsReturn = {
	products: ProductCard[]
	total: number
}

export async function filterProducts(
	filters: Partial<ProductFilters>,
	{ page = 1, pageSize = 9 }: FetchProductsOptions = {}
): Promise<FilterProductsReturn> {
	const conditions = []

	// Price filtering
	if (filters.min && filters.max)
		conditions.push(
			between(products.priceInCents, toCents(filters.min), toCents(filters.max))
		)
	else if (filters.min)
		conditions.push(gte(products.priceInCents, toCents(filters.min)))
	else if (filters.max)
		conditions.push(lte(products.priceInCents, toCents(filters.max)))

	// Size filtering
	if (filters.size?.length)
		conditions.push(
			arrayOverlaps(
				products.sizes,
				isArray(filters.size) ? filters.size : [filters.size]
			)
		)

	// Color filtering
	if (filters.color?.length) {
		conditions.push(
			exists(
				db
					.select({})
					.from(productsToColors)
					.innerJoin(colors, eq(productsToColors.colorId, colors.id))
					.where(
						and(
							eq(productsToColors.productId, products.id),
							isArray(filters.color)
								? inArray(colors.slug, filters.color)
								: eq(colors.slug, filters.color)
						)
					)
					.limit(1)
			)
		)
	}

	// Category filtering
	if (filters.category?.length) {
		conditions.push(
			inArray(
				products.categoryId,
				db
					.select({ cid: categories.id })
					.from(products)
					.innerJoin(categories, eq(products.categoryId, categories.id))
					.where(
						isArray(filters.category)
							? inArray(categories.slug, filters.category)
							: eq(categories.slug, filters.category)
					)
			)
		)
	}

	// Sorting
	const productSortOptions = {
		price: sql<number>`(
      round(${products.priceInCents} - (${products.priceInCents} * ${products.discount}) / 100)
    )`,
		date: products.createdAt,
		rating: sql<number>`(
      SELECT COALESCE(AVG(r.rating), 0) ::float
      FROM reviews r
      WHERE r.product_id = ${products.id}
    )`
	} as const

	let orderBy = desc(products.createdAt)

	if (filters.sortby) {
		const [column, order] = filters.sortby.split('-') as [
			keyof typeof productSortOptions,
			'asc' | 'desc'
		]

		// Validate column and order
		if (column in productSortOptions && (order === 'asc' || order === 'desc')) {
			orderBy =
				order === 'asc'
					? asc(productSortOptions[column])
					: desc(productSortOptions[column])
		}
	}

	// Fetch filtered products
	const results = await db.query.products.findMany({
		where: and(
			isNull(products.deletedAt),
			eq(products.archived, false),
			...conditions
		),
		columns: {
			id: true,
			slug: true,
			discount: true,
			name: true,
			priceInCents: true
		},
		with: {
			images: {
				columns: { url: true },
				limit: 1
			}
		},
		extras: {
			averageRating: sql<number>`(
        SELECT COALESCE(AVG(r.rating), 0) ::float
        FROM reviews r
        WHERE r.product_id = ${products.id}
      )`.as('average_rating'),
			totalCount: sql<number>`(COUNT(*) OVER() ::integer)`.as('total_count')
		},
		orderBy,
		offset: (page - 1) * pageSize,
		limit: pageSize
	})

	const total = results.length > 0 ? results[0].totalCount : 0

	results.forEach(product => {
		// @ts-expect-error
		delete product.totalCount
	})

	return { products: results, total }
}
