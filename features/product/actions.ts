'use server'

import { db } from '@/db'
import { products, productsToColors } from '@/db/schema'
import { Category } from '@/db/schema/categories'
import { Color } from '@/db/schema/colors'
import {
	NewProductImage,
	ProductImage,
	productImages
} from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { ProductToColor } from '@/db/schema/products-to-colors'
import { Review } from '@/db/schema/reviews'
import { User } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify, toCents } from '@/lib/utils'
import { and, eq, inArray, isNotNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'
import { requirePermission } from '../action-utils'
import { ProductCard } from './types'
import { editProductSchema, newProductSchema } from './zod'

const imagesSchema = z
	.object({
		key: z
			.string()
			.trim()
			.min(1, 'Image key is required')
			.max(48, 'Invalid image key'),
		url: z.string().trim().url()
	})
	.array()
	.min(1, 'At least one image is required')
	.max(10, 'Max 10 images allowed')

const uploadthingApi = new UTApi()

export async function createProduct(
	data: z.infer<typeof newProductSchema>,
	images: NewProductImage[],
	path = '/dashboard/products'
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role!, 'products', ['create'])
		)
			throw new Error('Unauthorized')

		console.log(images)

		const validatedImages = imagesSchema.parse(images)
		const validatedData = newProductSchema.parse(data)

		const { price: priceInDollars, category, colors, ...rest } = validatedData

		const [newProduct] = await db
			.insert(products)
			.values({
				slug: slugify(rest.name),
				priceInCents: toCents(priceInDollars),
				categoryId: category,
				userId: currentUser.id,
				...rest
			})
			.returning({ id: products.id })

		if (!newProduct) throw new Error('Failed to insert data in products table')

		const linkColors = db.insert(productsToColors).values(
			colors.map(colorId => ({
				colorId,
				productId: newProduct.id
			}))
		)

		const linkImages = db.insert(productImages).values(
			validatedImages.map(image => ({
				...image,
				productId: newProduct.id
			}))
		)

		await Promise.all([linkColors, linkImages])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_PRODUCT]:', error)

		await uploadthingApi.deleteFiles(images?.map(image => image.key))

		return {
			success: false,
			message:
				'Something went wrong while trying to create new product. Please try again later.'
		}
	}
}

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
			}
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

export type GetProductBySlugReturnProduct = Product & {
	productsToColors: (ProductToColor & { color: Color })[]
	images: ProductImage[]
	category: Category
	reviews: Pick<Review, 'rating'>[]
}

export type GetProductBySlugReturn =
	| { success: true; product: GetProductBySlugReturnProduct }
	| { success: false; message: string }

export async function getProductBySlug(
	slug: string
): Promise<GetProductBySlugReturn> {
	try {
		const product = (await db.query.products.findFirst({
			where: (products, { isNull }) =>
				and(
					eq(products.slug, slug),
					isNull(products.deletedAt),
					eq(products.archived, false)
				),
			with: {
				images: true,
				productsToColors: {
					with: { color: true }
				},
				reviews: {
					columns: { rating: true }
				},
				category: true
			}
		})) as GetProductBySlugReturnProduct

		if (!product) throw new Error('Product not found.')

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_BY_SLUG]:', error)
		return { success: false, message: 'Product not found or it was deleted' }
	}
}

export type GetProductByIdReturnProduct = Product & {
	productsToColors: (ProductToColor & { color: Color })[]
	images: ProductImage[]
	category: Category
}

export type GetProductByIdReturn =
	| { success: true; product: GetProductByIdReturnProduct }
	| { success: false; message: string }

export async function getProductById(
	id: string | number
): Promise<GetProductByIdReturn> {
	try {
		const product = (await db.query.products.findFirst({
			where: (products, { isNull }) =>
				and(
					eq(products.id, Number(id)),
					isNull(products.deletedAt),
					eq(products.archived, false)
				),
			with: {
				images: true,
				productsToColors: {
					with: { color: true }
				},
				category: true
			}
		})) as GetProductByIdReturnProduct

		if (!product) throw new Error('Product not found.')

		return { success: true, product }
	} catch (error) {
		console.error('[GET_PRODUCT_BY_ID]:', error)
		return { success: false, message: 'Product not found or it was deleted' }
	}
}

export async function getDeletedProducts(): Promise<GetProductsForAdminReturn> {
	try {
		await requirePermission('products', ['delete'])

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
	| {
			success: true
			products: ProductCard[]
	  }
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
				},
				reviews: {
					where: (review, { eq }) => eq(review.approved, true),
					columns: { rating: true }
				}
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
				},
				reviews: {
					where: (review, { eq }) => eq(review.approved, true),
					columns: { rating: true }
				}
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

export async function searchProducts(query: string) {
	if (!query?.length) return db.query.products.findMany()

	// TODO: Implement search feature
	return db.query.products.findMany()
}

type UpdateProductReturn =
	| { success: true; slug: string }
	| { success: false; message: string }

export async function updateProduct(
	productId: number,
	newData: z.infer<typeof editProductSchema>,
	images?: NewProductImage[]
): Promise<UpdateProductReturn> {
	try {
		await requirePermission('products', ['update'])

		const validatedData = editProductSchema.parse(newData)

		if (images) {
			await handleImages(productId, images)
		}

		const {
			price: priceInDollars,
			category: categoryId,
			colors,
			...rest
		} = validatedData

		await db.transaction(async tx => {
			await tx
				.delete(productsToColors)
				.where(eq(productsToColors.productId, productId))
			await tx.insert(productsToColors).values(
				colors.map(colorId => ({
					colorId,
					productId
				}))
			)
		})

		const slug = slugify(rest.name)

		await db
			.update(products)
			.set({
				...rest,
				priceInCents: toCents(priceInDollars),
				slug,
				categoryId
			})
			.where(eq(products.id, productId))

		return { success: true, slug }
	} catch (error) {
		console.error('[UPDATE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Please try again later.'
		}
	}
}

async function handleImages(productId: number, images: NewProductImage[]) {
	if (images.length === 0) throw new Error('No images provided')

	// Validate images
	const validatedImages = imagesSchema.parse(images)

	// Fetch current product image keys
	const existingKeys = await db.query.productImages
		.findMany({
			where: eq(productImages.productId, productId),
			columns: { key: true }
		})
		.then(images => images.map(image => image.key))

	// Determine images to delete and add
	const imagesToDelete = existingKeys.filter(key =>
		validatedImages.every(image => image.key !== key)
	)
	const imagesToAdd = validatedImages.filter(
		image => !existingKeys.includes(image.key)
	)

	await db.transaction(async tx => {
		const res = await db
			.delete(productImages)
			.where(
				and(
					eq(productImages.productId, productId),
					inArray(productImages.key, imagesToDelete)
				)
			)

		if (res.rowCount !== imagesToDelete.length) {
			tx.rollback()
		}

		await uploadthingApi.deleteFiles(imagesToDelete)

		if (imagesToAdd.length > 0) {
			await db.insert(productImages).values(
				imagesToAdd.map(image => ({
					...image,
					productId
				}))
			)
		}
	})
}

type SoftDeleteReturn = { success: true } | { success: false; message: string }

export async function softDeleteProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products'
): Promise<SoftDeleteReturn> {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		await db
			.update(products)
			.set({ deletedAt: new Date() })
			.where(eq(products.id, productId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[SOFT_DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Failed to move to trash. Please try again later.'
		}
	}
}

export async function restoreProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products/trash'
) {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		await db
			.update(products)
			.set({ deletedAt: null })
			.where(eq(products.id, productId))

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Pleas try again later'
		}
	}
}

type PurgeSoftDeletedProductsReturn =
	| { success: true }
	| { success: false; message: string }

export async function purgeSoftDeletedProducts(
	path = '/dashboard/products/trash'
): Promise<PurgeSoftDeletedProductsReturn> {
	try {
		await requirePermission('products', ['delete'])

		const softDeletedProducts = await db.query.products.findMany({
			where: (products, { isNotNull }) => isNotNull(products.deletedAt),
			columns: { id: true },
			with: {
				images: { columns: { key: true } }
			}
		})

		const imagesToDelete = softDeletedProducts.flatMap(product =>
			product.images.map(image => image.key)
		)

		const deleteImages = uploadthingApi.deleteFiles(imagesToDelete)
		const removeFromDB = db
			.delete(products)
			.where(isNotNull(products.deletedAt))

		await Promise.all([deleteImages, removeFromDB])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[PURGE_SOFT_DELETED_PRODUCTS]:', error)
		return {
			success: false,
			message:
				'Something went wrong while emptying trash bin. Please try again later.'
		}
	}
}

type DeleteProductReturn =
	| { success: true }
	| { success: false; message: string }

export async function deleteProduct(
	prev: any,
	formData?: FormData,
	path = '/dashboard/products/trash'
): Promise<DeleteProductReturn> {
	try {
		await requirePermission('products', ['delete'])

		const productId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('productId') as string)

		const productImageKeys = await db.query.productImages
			.findMany({
				where: eq(productImages.productId, productId),
				columns: {
					key: true
				}
			})
			.then(images => images.map(image => image.key))

		const deleteImages = uploadthingApi.deleteFiles(productImageKeys)
		const removeFromDB = db.delete(products).where(eq(products.id, productId))

		await Promise.all([deleteImages, removeFromDB])

		revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_PRODUCT]:', error)
		return {
			success: false,
			message: 'Something went wrong. Pleas try again later'
		}
	}
}
