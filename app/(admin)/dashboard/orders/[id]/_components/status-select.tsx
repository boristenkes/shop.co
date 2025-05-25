'use client'

import { getOrderStatusColor } from '@/app/(root)/orders/order-list'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { OrderStatus, TOrderStatus } from '@/db/schema/enums'
import { Order } from '@/db/schema/orders'
import { updateOrder } from '@/features/orders/actions/update'
import { cn } from '@/lib/utils'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const orderStatusSchema = z.nativeEnum(OrderStatus)

type OrderStatusSelectProps = {
	orderId: Order['id']
	defaultOrderStatus: TOrderStatus
}

export default function OrderStatusSelect({
	orderId,
	defaultOrderStatus
}: OrderStatusSelectProps) {
	const [isPending, startTransition] = useTransition()

	const handleChange = async (newOrderStatus: TOrderStatus) => {
		startTransition(async () => {
			newOrderStatus = orderStatusSchema.parse(newOrderStatus)

			const response = await updateOrder(orderId, { status: newOrderStatus })

			if (!response.success)
				toast.error('Failed to assign orderStatus. Please try again later.')
		})
	}

	return (
		<Select
			onValueChange={handleChange}
			defaultValue={defaultOrderStatus}
			disabled={isPending}
		>
			<SelectTrigger
				disabled={isPending}
				className='capitalize w-32'
			>
				<SelectValue placeholder={defaultOrderStatus} />
			</SelectTrigger>
			<SelectContent>
				{Object.values(OrderStatus).map(orderStatus => (
					<SelectItem
						key={orderStatus}
						value={orderStatus}
						className='capitalize'
					>
						<div className='flex items-center gap-2'>
							<div
								className={cn(
									'size-2 rounded-full',
									getOrderStatusColor(orderStatus)
								)}
							/>
							{orderStatus}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
