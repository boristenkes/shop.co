import { cn } from '@/lib/utils'
import { type ProductCard as TProductCard } from '../types'
import ProductCard, { ProductCardSkeleton } from './product-card'

type ProductCartListProps = React.ComponentProps<'div'> & {
	products: TProductCard[]
}

export default function ProductCardList({
	products,
	className,
	...props
}: ProductCartListProps) {
	return (
		<div
			className={cn(
				'flex flex-wrap justify-center mx-auto w-fit gap-8 mt-16',
				className
			)}
			{...props}
		>
			{products.map(product => (
				<ProductCard
					key={product.slug}
					product={product}
				/>
			))}
		</div>
	)
}

export function ProductCardListSkeleton({
	itemCount,
	className,
	...props
}: React.ComponentProps<'div'> & { itemCount: number }) {
	return (
		<div
			className={cn(
				'flex flex-wrap justify-center mx-auto w-fit gap-8 mt-16',
				className
			)}
			{...props}
		>
			{Array.from({ length: itemCount }).map((_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	)
}
