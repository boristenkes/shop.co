import { CartItemListSkeleton } from '@/components/cart/item-list'
import { Skeleton } from '@/components/ui/skeleton'
import OrderSummary from './order-summary'

export default function CartPageLoading() {
	return (
		<main className='container pt-6'>
			<Skeleton className='w-28 h-6 rounded-lg' />

			<Skeleton className='w-56 h-10 rounded-lg mt-6' />

			<div className='flex items-start gap-4 mt-6'>
				<CartItemListSkeleton className='basis-3/5' />

				<OrderSummary />
			</div>
		</main>
	)
}
