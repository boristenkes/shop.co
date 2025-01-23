import { ProductImage } from '@/db/schema/product-images'
import { Product } from '@/db/schema/products'
import { Review } from '@/db/schema/reviews'

export type ProductCard = Pick<
	Product,
	'discount' | 'name' | 'priceInCents' | 'slug' | 'id'
> & { images: Pick<ProductImage, 'url'>[]; reviews: Pick<Review, 'rating'>[] }
