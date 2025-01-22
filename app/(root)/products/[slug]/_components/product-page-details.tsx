import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { TSize } from '@/db/schema/enums'
import { getProductBySlug } from '@/features/product/actions'
import { auth } from '@/lib/auth'
import { integralCf } from '@/lib/fonts'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import Link from 'next/link'
import ProductPageForm from './form'
import ImageCarousel from './image-carousel'

export default async function ProductPageDetails({ slug }: { slug: string }) {
	const session = await auth()
	const currentUserId = session?.user.id

	const response = await getProductBySlug(slug)

	if (!response.success) return <ErrorMessage message={response.message} />

	const { product } = response

	return (
		<div className='container py-9 flex items-start justify-center gap-10 flex-col lg:flex-row'>
			<div className='basis-1/2 shrink-0'>
				<ImageCarousel images={product.images} />
			</div>

			<div className='space-y-4'>
				<div>
					<Link
						href={`/products?category=${product.category.slug}`}
						className='hover:opacity-80'
					>
						{product.category.name}
					</Link>
					<h1
						className={`${integralCf.className} text-4xl font-bold uppercase`}
					>
						{product.name}
					</h1>
				</div>

				<Rating rating={4} />

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
								-{product.discount}%
							</small>
						</p>
					)}
				</div>

				<p className='text-balance border-b pb-6'>{product.description}</p>

				<ProductPageForm
					colors={product.productsToColors.map(({ color }) => color)}
					sizes={product.sizes as TSize[]}
					stock={product.stock as number}
					currentUserId={currentUserId}
					productId={product.id}
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

				{/* <ProductPageForm
			colors={product.productsToColors.map(({ color }) => color)}
			sizes={product.sizes as TSize[]}
			stock={product.stock as number}
			currentUserId={currentUserId}
			productId={product.id}
		/> */}
			</div>
		</div>
	)
}
