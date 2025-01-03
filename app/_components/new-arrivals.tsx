import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/features/product/actions'
import ProductCard from '@/features/product/components/product-card'
import { integralCf } from '@/lib/fonts'
import Link from 'next/link'

export default async function NewArrivals() {
	const response = await getProducts()

	return (
		<section className='py-16 border-b container'>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
			>
				New Arrivals
			</h2>

			{response.success ? (
				<div className='flex items-end justify-between gap-4 mt-14 mb-9'>
					{response.products.map(product => (
						<ProductCard
							key={product.slug}
							product={product}
						/>
					))}
				</div>
			) : (
				<ErrorMessage message={response.message} />
			)}

			<div className='w-full flex justify-center pt-6'>
				<Button
					asChild
					variant='outline'
					size='lg'
					className='mx-auto'
				>
					<Link href='/products?sortby=date-desc'>View All</Link>
				</Button>
			</div>
		</section>
	)
}
