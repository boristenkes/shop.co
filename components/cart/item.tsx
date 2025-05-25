'use client'

import { SessionCartItem } from '@/context/cart'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { Skeleton } from '../ui/skeleton'
import CartItemQuantity from './cart-item-quantity'
import DeleteCartItemButton from './delete-cart-item-button'

export default function CartItem({ item }: { item: SessionCartItem }) {
	const totalPrice = useMemo(() => {
		const priceWithDiscount = calculatePriceWithDiscount(
			item.product.priceInCents,
			item.product.discount!
		)

		return priceWithDiscount * item.quantity
	}, [item])
	const href = `/products/${item.product.slug}/${item.product.id}?color=${item.color.slug}&size=${item.size}`

	return (
		<li className='flex gap-3.5 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:pb-3.5'>
			<Link
				href={href}
				className='bg-stone-100 rounded-lg aspect-square w-[100px] shrink-0'
			>
				<Image
					src={item.product.image}
					alt={item.product.name}
					width={100}
					height={100}
					className='size-full object-contain'
				/>
			</Link>

			<div className='flex-1'>
				<div className='flex items-center justify-between gap-2 w-full'>
					<Link
						href={href}
						className='line-clamp-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis grow'
					>
						{item.product.name}
					</Link>

					<DeleteCartItemButton itemId={item.id} />
				</div>

				<div className='text-sm'>
					<p>
						Size: <span className='text-neutral-600'>{item.size}</span>
					</p>
					<p>
						Color: <span className='text-neutral-600'>{item.color.name}</span>
					</p>
				</div>

				<div className='flex items-center justify-between gap-4'>
					<strong>{formatPrice(totalPrice)}</strong>
					<CartItemQuantity
						itemId={item.id}
						maxQuantity={Math.min(item.product.stock!, 20)}
					/>
				</div>
			</div>
		</li>
	)
}

export function CartItemSkeleton() {
	return (
		<li className='flex gap-3.5 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:pb-3.5'>
			<Skeleton className='rounded-lg aspect-square w-[100px] shrink-0' />

			<div className='flex-1'>
				<div className='flex items-center justify-between gap-2 w-full mb-2'>
					<Skeleton className='w-36 h-8' />
					<Skeleton className='size-6 rounded-sm' />
				</div>

				<div className='flex flex-col gap-2'>
					<Skeleton className='w-16 h-4 rounded-sm' />
					<Skeleton className='w-20 h-4 rounded-sm' />
				</div>

				<div className='flex items-center justify-between gap-4'>
					<Skeleton className='w-14 h-6 rounded-sm' />
					<Skeleton className='w-28 h-10 rounded-full' />
				</div>
			</div>
		</li>
	)
}
