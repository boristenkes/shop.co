'use client'

import NumberInput from '@/components/number-input'
import { SessionCartItem, useCart } from '@/context/cart'
import { calculatePriceWithDiscount, formatPrice } from '@/lib/utils'
import { Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function CartItem({ item }: { item: SessionCartItem }) {
	const { removeFromCart, editCartItem } = useCart()
	const [quantity, setQuantity] = useState(item.quantity)
	const totalPrice = useMemo(() => {
		const priceWithDiscount = calculatePriceWithDiscount(
			item.product.priceInCents,
			item.product.discount!
		)

		return priceWithDiscount * quantity
	}, [item, quantity])
	const href = `/products/${item.product.slug}/${item.product.id}?color=${item.color.slug}&size=${item.size}`

	return (
		<li className='flex gap-3.5 [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:pb-3.5'>
			<Link
				href={href}
				className='bg-stone-100 rounded-lg'
			>
				<Image
					src={item.product.image}
					alt={item.product.name}
					width={100}
					height={100}
				/>
			</Link>

			<div className='flex-1'>
				<div className='flex items-center justify-between gap-2 w-full'>
					<Link
						href={href}
						className='line-clamp-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-1'
					>
						{item.product.name}
					</Link>
					<button onClick={() => removeFromCart(item.id)}>
						<Trash2Icon className='text-red-500 size-4' />
					</button>
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
					<NumberInput
						value={quantity}
						onChange={newQuantity => {
							editCartItem(item.id, { quantity: newQuantity })
							setQuantity(newQuantity)
						}}
						max={item.product.stock!}
						size='sm'
					/>
				</div>
			</div>
		</li>
	)
}
