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
import { GetOwnOrdersOrder } from '@/features/orders/actions/read'
import OrderStatusBadge from '@/features/orders/components/status-badge'
import { formatId } from '@/utils/format'
import { ArrowRightIcon, ReceiptTextIcon } from 'lucide-react'
import Link from 'next/link'
import CancelOrderButton from './cancel-button'
import OrderTable, { OrderTableSkeleton } from './order-table'

export default function OrderList({ orders }: { orders: GetOwnOrdersOrder[] }) {
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
								<div className='flex items-center gap-8'>
									<CardTitle>Order ID: {formatId(order.id)}</CardTitle>
									{order.receiptUrl && (
										<a
											href={order.receiptUrl}
											className='font-semibold text-slate-700 hover:text-slate-500 flex items-center gap-2'
											target='_blank'
										>
											View Receipt <ReceiptTextIcon className='size-4' />
										</a>
									)}
								</div>
								<CardDescription className='mt-2'>
									{order.shippingAddress ?? 'No address'}
								</CardDescription>
							</div>

							<div className='flex items-center gap-2'>
								{order.status === 'pending' && (
									<CancelOrderButton orderId={order.id} />
								)}
								<OrderStatusBadge status={order.status} />
							</div>
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
