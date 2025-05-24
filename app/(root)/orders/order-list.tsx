import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Paragraph from '@/components/utils/paragraph'
import { Order } from '@/db/schema/orders'
import { GetUserOrdersOrder } from '@/features/orders/actions/read'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import OrderTable, { OrderTableSkeleton } from './order-table'

export default function OrderList({
	orders
}: {
	orders: GetUserOrdersOrder[]
}) {
	if (orders.length === 0)
		return (
			<div className='text-center py-16'>
				<h1 className='text-3xl'>You haven&apos;t placed any orders yet</h1>
				<Paragraph className='mx-auto mt-4'>
					This is where you will find your future orders.
				</Paragraph>
				<Button
					asChild
					className='mt-8'
				>
					<Link href='/products'>
						Start shopping <ArrowRightIcon />
					</Link>
				</Button>
			</div>
		)

	return (
		<ul className='my-8 space-y-12'>
			{orders.map(order => (
				<li key={order.id}>
					<Card>
						<CardHeader className='flex justify-between flex-row items-start'>
							<div>
								<CardTitle>Order ID: {order.id}</CardTitle>
								<CardDescription className='mt-2'>
									{order.shippingAddress ?? 'No address'}
								</CardDescription>
							</div>

							<Badge
								className='capitalize flex items-center gap-1'
								variant='outline'
							>
								<div
									className={cn(
										'size-2 rounded-full',
										getOrderStatusColor(order.status)
									)}
								/>
								{order.status}
							</Badge>
						</CardHeader>
						<CardContent>
							<OrderTable order={order} />
						</CardContent>
					</Card>
				</li>
			))}
		</ul>
	)
}

function getOrderStatusColor(status: Order['status']) {
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

export function OrderListSkeleton({ itemCount }: { itemCount: number }) {
	return (
		<ul className='my-8 space-y-12'>
			{Array.from({ length: itemCount }).map((_, idx) => (
				<li key={idx}>
					<Card>
						<CardHeader className='flex justify-between flex-row items-start'>
							<div>
								<CardTitle>
									<Skeleton className='w-[130px] h-6 rounded-lg' />
								</CardTitle>
								<CardDescription className='mt-2'>
									<Skeleton className='w-36 h-5 rounded-lg' />
								</CardDescription>
							</div>

							<Skeleton className='w-20 h-5 rounded-full' />
						</CardHeader>
						<CardContent>
							<OrderTableSkeleton itemCount={3} />
						</CardContent>
					</Card>
				</li>
			))}
		</ul>
	)
}
