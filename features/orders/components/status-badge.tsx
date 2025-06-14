import { Badge, BadgeProps } from '@/components/ui/badge'
import { Order } from '@/db/schema/orders'
import { OrderStatus } from '@/lib/enums'
import { cn } from '@/lib/utils'

export type OrderStatusBadgeProps = BadgeProps & {
	status: OrderStatus
}

export default function OrderStatusBadge({
	status,
	className,
	...props
}: OrderStatusBadgeProps) {
	return (
		<Badge
			className={cn('capitalize flex items-center gap-1 w-fit', className)}
			variant='outline'
			{...props}
		>
			<div className={cn('size-2 rounded-full', getOrderStatusColor(status))} />
			{status}
		</Badge>
	)
}

export function getOrderStatusColor(status: Order['status']) {
	switch (status) {
		case 'canceled':
			return 'bg-gray-500'
		case 'pending':
			return 'bg-yellow-500'
		case 'shipped':
			return 'bg-blue-500'
		case 'delivered':
			return 'bg-lime-500'
	}
}
