import { Rating } from '@/components/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/db/schema/product-images'
import { type ProductCard } from '@/features/product/types'
import { calculatePriceWithDiscount, cn, formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps } from 'react'

type ProductCardProps = ComponentProps<'article'> & {
	product: ProductCard & { images: Pick<ProductImage, 'url'>[] }
}

export default function ProductCard({
	product,
	className,
	...props
}: ProductCardProps) {
	return (
		<article
			className={cn('flex flex-col gap-4 group', className)}
			{...props}
		>
			<Link
				href={`/products/${product.slug}`}
				className='bg-[#f0eeed] size-80 rounded-lg grow p-4'
			>
				<Image
					src={product.images[0].url}
					alt={product.name}
					width={250}
					height={250}
					className='object-contain size-full group-hover:scale-105 transition-transform'
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

export function ProductCardSkeleton({
	className,
	...props
}: ComponentProps<'article'>) {
	return (
		<article
			className={cn('flex flex-col gap-4', className)}
			{...props}
		>
			<Skeleton className='size-80 rounded-lg grow' />

			<div className='grid gap-2'>
				<Skeleton className='w-44 h-6 rounded-sm' />
				<Skeleton className='w-28 h-6 rounded-sm' />
				<Skeleton className='w-20 h-8 rounded-sm' />
			</div>
		</article>
	)
}
