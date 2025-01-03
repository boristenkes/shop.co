import { Rating } from '@/components/rating'
import { ProductImage } from '@/db/schema/product-images.schema'
import { type ProductCard } from '@/features/product/types'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({
	product
}: {
	product: ProductCard & { images: Pick<ProductImage, 'url'>[] }
}) {
	return (
		<article className='grid gap-4'>
			<Link
				href={`/products/${product.slug}`}
				className='inline-block bg-[#f0eeed] size-64 rounded-lg'
			>
				<Image
					src={product.images[0].url}
					alt={product.name}
					width={250}
					height={250}
					className='size-[250px] object-contain'
				/>
			</Link>

			<div className='grid gap-2'>
				<Link
					href={`/products/${product.slug}`}
					className='text-xl font-bold'
				>
					{product.name}
				</Link>

				<Rating rating={7} />

				<div className='text-2xl font-bold'>
					{!product.discount || product.discount === 0 ? (
						formatPrice(product.priceInCents)
					) : (
						<div className='flex items-center space-x-3'>
							<div>
								{formatPrice(
									calculatePriceWithDiscount(
										product.priceInCents,
										product.discount
									)
								)}
							</div>
							<s className='text-gray-400 [text-decoration:line-through]'>
								{formatPrice(product.priceInCents)}
							</s>
							<small className='text-sm py-1.5 px-3 rounded-full bg-red-500/10 text-red-500'>
								-{product.discount}%
							</small>
						</div>
					)}
				</div>
			</div>
		</article>
	)
}
