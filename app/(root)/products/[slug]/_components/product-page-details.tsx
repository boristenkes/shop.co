import { Rating } from '@/components/rating'
import { TSize } from '@/db/schema/enums'
import { GetProductBySlugReturnProduct } from '@/features/product/actions'
import { integralCf } from '@/lib/fonts'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import ProductPageForm from './form'
import ImageCarousel from './image-carousel'

type ProductPageDataProps = {
	product: GetProductBySlugReturnProduct
}

export default async function ProductPageDetails({
	product
}: ProductPageDataProps) {
	return (
		<div className='container py-9 flex items-start justify-center gap-10'>
			<div className='grow shrink-0'>
				<ImageCarousel images={product.images} />
			</div>

			<div className='grow space-y-4'>
				<h1 className={`${integralCf.className} text-4xl font-bold uppercase`}>
					{product.name}
				</h1>

				<Rating rating={9} />

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
				/>
			</div>
		</div>
	)
}
