'use client'

import CartItemList, { CartItemListSkeleton } from '@/components/cart/item-list'
import ErrorMessage from '@/components/error-message'
import { useCart } from '@/context/cart'
import { ShoppingCartIcon } from 'lucide-react'
import OrderSummary, { OrderSummarySkeleton } from './order-summary'

export default function CartContents() {
	const cart = useCart()

	if (cart.isLoading)
		return (
			<div className='flex items-start gap-4 mt-6'>
				<CartItemListSkeleton className='basis-3/5' />
				<OrderSummarySkeleton />
			</div>
		)

	if (cart.isError)
		return (
			<ErrorMessage
				message='Something went wrong. Please try again later'
				className='mt-10'
			/>
		)

	if (cart.items.length === 0)
		return (
			<div className='mx-auto py-16 w-fit'>
				<ShoppingCartIcon className='size-32 mx-auto' />
				<p className='mx-auto mt-4 text-center font-medium text-2xl'>
					Your cart is empty
				</p>
			</div>
		)

	return (
		<div className='flex items-start gap-4 mt-6'>
			<CartItemList
				items={cart.items}
				className='basis-3/5'
			/>
			<OrderSummary />
		</div>
	)
}
