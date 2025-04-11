'use client'

import NumberInput from '@/components/number-input'
import { useCart } from '@/context/cart'
import { CartItem } from '@/db/schema/carts'
import { updateCartItem } from '@/features/cart/actions'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export type CartItemQuantityProps = {
	itemId: CartItem['id'] | string
	maxQuantity?: number
}

export default function CartItemQuantity({
	itemId,
	maxQuantity = Infinity
}: CartItemQuantityProps) {
	const cart = useCart()
	const defaultQuantity = cart.get(itemId)?.quantity ?? 0
	const [quantity, setQuantity] = useState(defaultQuantity)
	const session = useSession()
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

	const handleQuantityChange = async (newQuantity: number) => {
		newQuantity = Math.min(newQuantity, maxQuantity) // Limit quantity to maxQuantity

		if (session.status === 'loading') return

		if (session.status !== 'authenticated') {
			cart.edit(itemId, { quantity: newQuantity })
			return
		}

		if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

		debounceTimerRef.current = setTimeout(async () => {
			const response = await updateCartItem(Number(itemId), {
				quantity: newQuantity
			})

			if (!response.success)
				toast.error('Failed to update item quantity. Please try again later.')
		}, 250)

		setQuantity(newQuantity)
	}

	return (
		<NumberInput
			value={quantity}
			onChange={handleQuantityChange}
			max={maxQuantity}
			min={1}
			size='sm'
			disabled={session.status === 'loading'}
		/>
	)
}
