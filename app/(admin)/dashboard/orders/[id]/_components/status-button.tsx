'use client'

import { Button } from '@/components/ui/button'
import { Order } from '@/db/schema/orders'
import { updateOrder } from '@/features/orders/actions/update'
import { OrderStatus } from '@/lib/enums'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

type OrderStatusSelectProps = {
	orderId: Order['id']
	status: OrderStatus
}

export default function OrderStatusButton({
	orderId,
	status
}: OrderStatusSelectProps) {
	const pathname = usePathname()
	const newStatus = status === 'pending' ? 'shipped' : 'delivered'
	const mutation = useMutation({
		mutationKey: ['order:status'],
		mutationFn: () =>
			updateOrder(orderId, { status: newStatus }, { path: pathname }),
		onSettled(response) {
			if (!response?.success) toast.error('Something went wrong')
		}
	})

	if (!['pending', 'shipped'].includes(status)) return null

	return (
		<Button
			onClick={() => mutation.mutate()}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? (
				'Marking'
			) : (
				<span>
					Mark as <span className='capitalize'>{newStatus}</span>
				</span>
			)}
			{mutation.isPending && <Loader2Icon className='animate-spin' />}
		</Button>
	)
}
