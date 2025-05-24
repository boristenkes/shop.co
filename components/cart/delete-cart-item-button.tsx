'use client'

import { useCart } from '@/context/cart'
import { CartItem } from '@/db/schema/carts'
import { deleteCartItem } from '@/features/cart/actions/delete'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

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
				cart.remove(itemId)
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
			className='text-red-500 disabled:opacity-50'
		>
			{mutation.isPending ? (
				<Loader2Icon className='size-4 animate-spin' />
			) : (
				<Trash2Icon className='size-4' />
			)}
		</button>
	)
}
