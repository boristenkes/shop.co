'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/context/cart'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import { ArrowRightIcon, TagIcon } from 'lucide-react'

export default function OrderSummary() {
	const cart = useCart()
	const subtotalInCents = cart.items.reduce((acc, curr) => {
		const priceWithDiscount = calculatePriceWithDiscount(
			curr.product.priceInCents,
			curr.product.discount!
		)

		return acc + priceWithDiscount * curr.quantity
	}, 0)
	const totalInCents = calculatePriceWithDiscount(subtotalInCents, 0)

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
					<dt className='font-medium'>Total</dt>
					<dd>
						<strong>{formatPrice(totalInCents)}</strong>
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
				<div className='relative grow'>
					<TagIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400' />
					<input
						type='text'
						id='promo-code'
						name='promo-code'
						placeholder='Add promo code'
						aria-label='Promo code'
						className='w-full py-3 pl-12 rounded-full bg-neutral-100 placeholder-neutral-400'
					/>
				</div>
				<Button
					type='submit'
					className='px-8 h-11'
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

export function OrderSummarySkeleton() {
	return (
		<aside className='grow p-3.5 rounded-3xl border-2 overflow-y-auto custom-scrollbar scroll-p-3.5 basis-2/5'>
			<Skeleton className='w-32 h-6 rounded-lg mb-4' />

			<dl className='space-y-3 mb-6'>
				<div className='flex items-center justify-between'>
					<Skeleton className='w-14 h-6 rounded-lg' />
					<Skeleton className='w-12 h-6 rounded-lg' />
				</div>
				<div className='flex items-center justify-between'>
					<Skeleton className='w-16 h-6 rounded-lg' />
					<Skeleton className='w-12 h-6 rounded-lg' />
				</div>
				<div className='flex items-center justify-between'>
					<Skeleton className='w-20 h-6 rounded-lg' />
					<Skeleton className='w-32 h-6 rounded-lg' />
				</div>
				<div className='border-t pt-3 flex items-center justify-between text-lg'>
					<Skeleton className='w-10 h-6' />
					<Skeleton className='w-10 h-6' />
				</div>
			</dl>

			<div className='flex items-center gap-2 mb-6'>
				<Skeleton className='w-full h-10 rounded-lg grow' />
				<Skeleton className='w-28 h-10 rounded-full' />
			</div>

			<Skeleton className='w-full h-12 rounded-full' />
		</aside>
	)
}
