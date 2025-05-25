import ErrorMessage from '@/components/error-message'
import { getAllOrders } from '@/features/orders/actions/read'
import { columns } from './columns'
import { OrdersTable } from './table'

export default async function OrdersPage() {
	const response = await getAllOrders()

	return (
		<div className='space-y-8 container'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<h1 className='text-3xl font-bold'>Orders Management</h1>
			</div>

			{response.success ? (
				<OrdersTable
					data={response.orders}
					columns={columns}
				/>
			) : (
				<ErrorMessage message={response.message ?? 'Something went wrong'} />
			)}
		</div>
	)
}
