import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'

export type ProductCard = Pick<
	Product,
	'discount' | 'name' | 'priceInCents' | 'slug' | 'id'
> & { averageRating: number; images: Pick<ProductImage, 'url'>[] }
