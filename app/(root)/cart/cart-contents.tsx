'use client'

import CartItemList, { CartItemListSkeleton } from '@/components/cart/item-list'
import { useCart } from '@/context/cart'
import OrderSummary from './order-summary'

export default function CartContents() {
	const cart = useCart()

	return (
		<div className='flex items-start gap-4 mt-6'>
			{cart.isLoading ? (
				<CartItemListSkeleton className='basis-3/5' />
			) : cart.items.length > 0 ? (
				<CartItemList
					items={cart.items}
					className='basis-3/5'
				/>
			) : (
				<p className='text-center py-16 basis-3/5'>Your cart is empty</p>
			)}

			<OrderSummary />
		</div>
	)
}
