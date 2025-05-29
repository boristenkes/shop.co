'use client'

import CartItemList, { CartItemListSkeleton } from '@/components/cart/item-list'
import ErrorMessage from '@/components/error-message'
import { useCart } from '@/context/cart'
import { ShoppingCartIcon } from 'lucide-react'
import OrderSummary, { OrderSummarySkeleton } from './order-summary'

export default function CartContents({ isSignedIn }: { isSignedIn: boolean }) {
	const cart = useCart()

	if (cart.isLoading) return <CartContentsSkeleton />

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
		<div className='flex items-start max-md:flex-col gap-4 mt-6'>
			<CartItemList
				items={cart.items}
				className='basis-3/5 max-md:w-full'
			/>
			<OrderSummary isSignedIn={isSignedIn} />
		</div>
	)
}

export function CartContentsSkeleton() {
	return (
		<div className='flex items-start max-md:flex-col gap-4 mt-6'>
			<CartItemListSkeleton className='basis-3/5 max-md:w-full' />
			<OrderSummarySkeleton />
		</div>
	)
}
