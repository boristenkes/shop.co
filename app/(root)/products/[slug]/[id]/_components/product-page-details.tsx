import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Skeleton } from '@/components/ui/skeleton'
import Paragraph from '@/components/utils/paragraph'
import { TSize } from '@/db/schema/enums'
import { Product } from '@/db/schema/products'
import { getProductById } from '@/features/product/actions/read'
import { integralCf } from '@/lib/fonts'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { formatPrice } from '@/utils/format'
import Link from 'next/link'
import ProductPageForm from './form'
import ImageCarousel from './image-carousel'

export default async function ProductPageDetails({
	id
}: {
	id: Product['id']
}) {
	const response = await getProductById(id)

	if (!response.success)
		return (
			<ErrorMessage
				message={response.message}
				className='container my-8'
			/>
		)

	const { product } = response

	return (
		<div className='container py-9 flex items-start justify-center gap-10 flex-col lg:flex-row'>
			<div className='basis-1/2 shrink-0'>
				<ImageCarousel images={product.images} />
			</div>

			<div className='space-y-4'>
				<div>
					{product.category && (
						<Link
							href={`/products?category=${product.category.slug}`}
							className='hover:opacity-80'
						>
							{product.category.name}
						</Link>
					)}
					<h1
						className={`${integralCf.className} text-4xl font-bold uppercase`}
					>
						{product.name}
					</h1>
				</div>

				{product.averageRating > 0 ? (
					<div className='flex items-center space-x-2'>
						<Rating rating={product.averageRating} />

						<span className='text-gray-700 text-sm'>
							{product.averageRating.toFixed(1)}
							<span className='text-gray-400'>/5</span>
						</span>
					</div>
				) : (
					<p>No rating</p>
				)}

				<div className='text-3xl font-bold'>
					{!product.discount || product.discount === 0 ? (
						formatPrice(product.priceInCents)
					) : (
						<p className='flex items-center space-x-3'>
							<span>
								{formatPrice(
									calculatePriceWithDiscount(
										product.priceInCents,
										product.discount
									)
								)}
							</span>
							<s className='text-gray-400 [text-decoration:line-through] opacity-70'>
								{formatPrice(product.priceInCents)}
							</s>
							<small className='text-lg py-1.5 px-3 rounded-full bg-red-500/10 text-red-500'>
								&minus;{product.discount}%
							</small>
						</p>
					)}
				</div>

				<Paragraph className='border-b pb-6'>{product.description}</Paragraph>

				<ProductPageForm
					colors={product.productsToColors.map(({ color }) => color)}
					sizes={product.sizes as TSize[]}
					stock={product.stock as number}
					product={{
						id: product.id,
						slug: product.slug,
						name: product.name,
						discount: product.discount,
						image: product.images[0].url,
						priceInCents: product.priceInCents,
						stock: product.stock
					}}
				/>
			</div>
		</div>
	)
}

export function ProductPageDetailsSkeleton() {
	return (
		<div className='container py-9 flex items-start justify-center gap-10 flex-col lg:flex-row'>
			<div className='flex items-center shrink-0 flex-col lg:flex-row-reverse gap-2'>
				<Skeleton className='h-[30rem] w-[32rem] rounded-md' />
				<Skeleton className='lg:w-24 w-[30rem] lg:h-[30rem] h-24 rounded-md grid' />
			</div>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<Skeleton className='w-14 h-5 rounded-sm' />
					<Skeleton className='w-96 h-10 rounded-sm' />
				</div>

				<Skeleton className='w-36 h-5 rounded-sm' />
				<Skeleton className='w-28 h-9 rounded-sm' />

				<div className='mb-6 space-y-2'>
					{Array.from({ length: 3 }).map((_, idx) => (
						<Skeleton
							key={idx}
							className='w-96 lg:w-[39rem] h-5 rounded-sm'
						/>
					))}
					<Skeleton className='w-24 h-5 rounded-sm' />
				</div>

				<div>
					<div className='flex gap-10 items-start pb-6 border-b'>
						<div className='space-y-4'>
							<Skeleton className='h-6 w-24 rounded-sm' />

							<div className='flex items-center gap-2 flex-wrap'>
								<Skeleton className='size-8 rounded-full' />
								<Skeleton className='size-8 rounded-full' />
								<Skeleton className='size-8 rounded-full' />
							</div>
						</div>

						<div className='space-y-4'>
							<Skeleton className='h-6 w-24 rounded-sm' />
							<div className='flex flex-wrap gap-2'>
								<Skeleton className='w-14 h-10 rounded-full' />
								<Skeleton className='w-14 h-10 rounded-full' />
								<Skeleton className='w-14 h-10 rounded-full' />
								<Skeleton className='w-14 h-10 rounded-full' />
							</div>
						</div>
					</div>

					<div className='flex items-center gap-5 mt-6'>
						<Skeleton className='w-40 h-12 rounded-full' />
						<Skeleton className='w-40 h-12 rounded-full grow' />
					</div>
				</div>
			</div>
		</div>
	)
}
