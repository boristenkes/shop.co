import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getFeaturedProducts } from '@/features/product/actions'
import ProductCard from '@/features/product/components/product-card'
import { integralCf } from '@/lib/fonts'
import Link from 'next/link'

export default async function FeaturedProducts() {
	const response = await getFeaturedProducts()

	return (
		<section className='py-16 border-b container'>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
			>
				Featured Products
			</h2>

			{response.success ? (
				<div className='flex flex-wrap justify-center mx-auto w-fit gap-8 mt-16'>
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
					<Link href='/products?featured=true'>View All</Link>
				</Button>
			</div>
		</section>
	)
}
