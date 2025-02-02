import ErrorMessage from '@/components/error-message'
import { Product } from '@/db/schema/products'
import { getRelatedProducts } from '@/features/product/actions'
import ProductCardList, {
	ProductCardListSkeleton
} from '@/features/product/components/product-list'
import { integralCf } from '@/lib/fonts'

type RelatedProductsProps = {
	productId: Product['id']
}

export default async function RelatedProducts({
	productId
}: RelatedProductsProps) {
	const response = await getRelatedProducts(productId)

	if (response.success && response.products.length === 0) return

	return (
		<section className='py-16 container'>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
			>
				You might also like
			</h2>

			{response.success ? (
				<ProductCardList
					products={response.products}
					className='flex-nowrap justify-start max-w-full overflow-x-auto custom-scrollbar'
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}
		</section>
	)
}

export function RelatedProductsSkeleton() {
	return (
		<section className='py-16 border-b container'>
			<h2
				className={`${integralCf.className} text-neutral-900 uppercase font-bold text-3xl lg:text-4xl xl:text-5xl text-balance text-center`}
			>
				You might also like
			</h2>

			<ProductCardListSkeleton itemCount={4} />
		</section>
	)
}
