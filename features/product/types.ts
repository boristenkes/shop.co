import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'

export type ProductCard = Pick<
	Product,
	'discount' | 'name' | 'priceInCents' | 'slug'
> & { images: Pick<ProductImage, 'url'>[] }
