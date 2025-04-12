'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import { ArrowRightIcon } from 'lucide-react'

export default function OrderSummary() {
	const cart = useCart()
	const subtotalInCents = cart.items.reduce((acc, curr) => {
		const priceWithDiscount = calculatePriceWithDiscount(
			curr.product.priceInCents,
			curr.product.discount!
		)

		return acc + priceWithDiscount * curr.quantity
	}, 0)

	return (
		<aside className='grow p-3.5 rounded-3xl border-2 overflow-y-auto custom-scrollbar scroll-p-3.5 basis-2/5'>
			<h2 className='font-semibold text-lg mb-4'>Order Summary</h2>

			<dl className='space-y-3 mb-6'>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Subtotal</dt>
					<dd className='font-semibold'>{formatPrice(subtotalInCents)}</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Discount (-0%)</dt>
					<dd className='font-semibold text-red-500'>-$0.00</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Delivery Fee</dt>
					<dd className='italic text-sm text-gray-600'>
						Calculated at checkout
					</dd>
				</div>
				<div className='border-t pt-3 flex items-center justify-between text-lg'>
					<dt>
						<strong>Total</strong>
					</dt>
					<dd>
						<strong>$467</strong>
					</dd>
				</div>
			</dl>

			<form className='flex items-center gap-2 mb-6'>
				<label
					htmlFor='promo-code'
					className='sr-only'
				>
					Promo code
				</label>
				<Input
					type='text'
					id='promo-code'
					name='promo-code'
					placeholder='Add promo code'
					aria-label='Promo code'
					className='grow'
				/>
				<Button
					type='submit'
					className='px-8'
				>
					Apply
				</Button>
			</form>

			<Button
				size='lg'
				className='w-full'
			>
				Go to Checkout <ArrowRightIcon />
			</Button>
		</aside>
	)
}
