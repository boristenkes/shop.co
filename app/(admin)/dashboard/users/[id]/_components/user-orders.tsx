import ErrorMessage from '@/components/error-message'
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { User } from '@/db/schema/users'
import { getUserOrders } from '@/features/orders/actions/read'
import OrderStatusBadge from '@/features/orders/components/status-badge'
import { formatDate, formatPrice } from '@/utils/format'
import Link from 'next/link'

export default async function UserOrders({ userId }: { userId: User['id'] }) {
	const response = await getUserOrders(userId)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const { orders } = response
	const hasOrders = orders.length > 0
	const totalSpent = orders.reduce((acc, curr) => {
		if (['pending', 'canceled'].includes(curr.status!)) return acc

		return acc + curr.totalPriceInCents
	}, 0)

	if (!hasOrders)
		return (
			<p className='text-center py-8'>This user did not place any orders.</p>
		)

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>ID</TableHead>
					<TableHead>Shipping Address</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Order date</TableHead>
					<TableHead>View</TableHead>
					<TableHead className='text-right'>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map(order => (
					<TableRow key={order.id}>
						<TableCell>
							<Link
								href={`/dashboard/orders/${order.id}`}
								className='hover:font-medium'
							>
								{order.id}
							</Link>
						</TableCell>
						<TableCell>
							{order.shippingAddress ? (
								<p className='line-clamp-2 text-left overflow-hidden text-ellipsis max-w-96'>
									{order.shippingAddress}
								</p>
							) : (
								<p className='italic text-gray-500'>No address</p>
							)}
						</TableCell>
						<TableCell>
							<OrderStatusBadge status={order.status} />
						</TableCell>
						<TableCell>
							<time
								dateTime={order.createdAt.toISOString()}
								className='whitespace-nowrap'
							>
								{formatDate(order.createdAt!, {
									month: 'long',
									day: '2-digit',
									year: 'numeric'
								})}
							</time>
						</TableCell>
						<TableCell>
							<Link
								href={`/dashboard/orders/${order.id}`}
								className='font-medium hover:underline'
							>
								View Order
							</Link>
						</TableCell>
						<TableCell className='text-right'>
							{formatPrice(order.totalPriceInCents)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={5}>Total Spent</TableCell>
					<TableCell className='text-right'>
						{formatPrice(totalSpent)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
