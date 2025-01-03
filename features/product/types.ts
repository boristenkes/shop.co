import { ProductImage } from '@/db/schema/product-images.schema'
import { Product } from '@/db/schema/products.schema'

export type ProductCard = Pick<
	Product,
	'discount' | 'name' | 'priceInCents' | 'slug'
> & { images: Pick<ProductImage, 'url'>[] }
