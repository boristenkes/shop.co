import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getFeaturedProducts } from '@/features/product/actions/read'
import ProductCardList, {
	ProductCardListSkeleton
} from '@/features/product/components/product-list'
import { integralCf } from '@/lib/fonts'
import Link from 'next/link'

export default async function FeaturedProducts() {
	const response = await getFeaturedProducts()

	return (
		<section
			className='py-16 border-b container'
			aria-labelledby='featured'
		>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
				id='featured'
			>
				Featured Products
			</h2>

			{response.success ? (
				<ProductCardList
					products={response.products}
					className='flex-nowrap justify-start max-w-full overflow-x-auto custom-scrollbar'
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}

			<div className='w-full flex justify-center pt-10'>
				<Button
					asChild
					variant='outline'
					size='lg'
					className='mx-auto'
				>
					<Link href='/products?featured=true'>View All</Link>
				</Button>
			</div>
		</section>
	)
}

export function FeaturedProductsSkeleton() {
	return (
		<section className='py-16 border-b container'>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
			>
				Featured Products
			</h2>

			<ProductCardListSkeleton itemCount={4} />

			<div className='w-full flex justify-center pt-6'>
				<Button
					variant='outline'
					size='lg'
					className='mx-auto'
					disabled
				>
					View All
				</Button>
			</div>
		</section>
	)
}
