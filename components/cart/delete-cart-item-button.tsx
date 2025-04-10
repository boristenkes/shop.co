'use client'

import { useCart } from '@/context/cart'
import { CartItem } from '@/db/schema/carts'
import { deleteCartItem } from '@/features/cart/actions'
import { useMutation } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { queryClient } from '../utils/providers'

export default function DeleteCartItemButton({
	itemId
}: {
	itemId: CartItem['id'] | string
}) {
	const session = useSession()
	const cart = useCart()
	const isAuthenticated = session.status === 'authenticated'
	const mutation = useMutation({
		mutationKey: ['cartitem:delete'],
		mutationFn: () => deleteCartItem(itemId),
		onSettled(data) {
			if (data?.success) {
				queryClient.invalidateQueries({
					queryKey: ['cart:get:own']
				})
			} else {
				toast.error('Failed to delete item. Please try again later.')
			}
		}
	})

	return (
		<button
			onClick={() => {
				if (isAuthenticated) {
					mutation.mutate()
				} else {
					cart.remove(itemId)
				}
			}}
			disabled={mutation.isPending}
			className='disabled:opacity-50'
		>
			<Trash2Icon className='text-red-500 size-4' />
		</button>
	)
}
