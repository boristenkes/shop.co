'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/context/cart'
import { useCookie } from '@/context/cookie'
import { validateCoupon } from '@/features/coupon/actions/read'
import { ClientCouponSchema } from '@/features/coupon/zod'
import { checkout } from '@/features/orders/actions/create'
import { stripePromise } from '@/lib/stripe-client'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { formatPrice } from '@/utils/format'
import { ArrowRightIcon, Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ApplyCouponForm from './coupon-form'

export default function OrderSummary({ isSignedIn }: { isSignedIn: boolean }) {
	const cart = useCart()
	const subtotalInCents = cart.items.reduce((acc, curr) => {
		const priceWithDiscount = calculatePriceWithDiscount(
			curr.product.priceInCents,
			curr.product.discount!
		)

		return acc + priceWithDiscount * curr.quantity
	}, 0)
	const totalInCents = calculatePriceWithDiscount(subtotalInCents, 0)
	const couponCookie = useCookie()
	const [coupon, setCoupon] = useState<ClientCouponSchema | null>(null)
	const [checkoutPending, setCheckoutPending] = useState(false)
	const discountText = coupon
		? coupon.type === 'fixed'
			? formatPrice(coupon.value)
			: `${coupon.value}%`
		: null
	const totalWithDiscount = !coupon
		? totalInCents
		: coupon.type === 'fixed'
		? totalInCents - coupon.value
		: calculatePriceWithDiscount(totalInCents, coupon.value)

	const handleCheckout = async () => {
		try {
			setCheckoutPending(true)
			const response = await checkout()

			if (!response.success) {
				toast.error('Something went wrong. Please try again later')
				return
			}

			const stripe = await stripePromise

			await stripe?.redirectToCheckout({
				sessionId: response.sessionId
			})
		} finally {
			setCheckoutPending(false)
		}
	}

	useEffect(() => {
		const validateStoredCoupon = async () => {
			if (!couponCookie.value) return

			const response = await validateCoupon(couponCookie.value, totalInCents)

			if (response.success) {
				setCoupon(response.coupon)
			} else {
				toast.warning(
					`Coupon (${couponCookie.value}) you previously entered is invalid now`
				)
				setCoupon(null)
				couponCookie.remove()
			}
		}

		validateStoredCoupon()
	}, [couponCookie.value])

	return (
		<aside className='grow p-3.5 rounded-3xl border-2 overflow-y-auto custom-scrollbar scroll-p-3.5 basis-2/5 max-md:w-full'>
			<h2 className='font-semibold text-lg mb-4'>Order Summary</h2>

			<dl className='space-y-3 mb-6'>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Subtotal</dt>
					<dd className='font-semibold'>{formatPrice(subtotalInCents)}</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Discount</dt>
					<dd className='font-semibold text-red-500'>
						{discountText ? `-${discountText}` : '-'}
					</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-gray-500'>Delivery</dt>
					<dd className='text-sm text-gray-600'>Free</dd>
				</div>
				<div className='border-t pt-3 flex items-center justify-between text-lg'>
					<dt className='font-medium'>Total</dt>
					<dd>
						<strong>{formatPrice(totalWithDiscount)}</strong>
					</dd>
				</div>
			</dl>

			<ApplyCouponForm
				disabled={checkoutPending}
				totalInCents={totalInCents}
				setCoupon={setCoupon}
			/>

			{coupon && (
				<div>
					Applied coupon:{' '}
					<Badge
						className='text-sm mt-2'
						variant='outline'
					>
						{coupon.code}
					</Badge>
				</div>
			)}

			<Button
				size='lg'
				className='w-full mt-6'
				onClick={handleCheckout}
				disabled={checkoutPending || !isSignedIn}
			>
				{isSignedIn
					? checkoutPending
						? 'Please wait'
						: 'Go to Checkout'
					: 'You must sign in'}{' '}
				{isSignedIn &&
					(checkoutPending ? (
						<Loader2Icon className='animate-spin size-4' />
					) : (
						<ArrowRightIcon />
					))}
			</Button>
		</aside>
	)
}

export function OrderSummarySkeleton() {
	return (
		<aside className='grow p-3.5 rounded-3xl border-2 overflow-y-auto custom-scrollbar scroll-p-3.5 basis-2/5 max-md:w-full'>
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
