import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

const orders = [
	{
		id: 1,
		customer: 'John Doe',
		date: '2023-06-01',
		status: 'Completed',
		total: 99.99
	},
	{
		id: 2,
		customer: 'Jane Smith',
		date: '2023-06-02',
		status: 'Processing',
		total: 149.99
	},
	{
		id: 3,
		customer: 'Bob Johnson',
		date: '2023-06-03',
		status: 'Shipped',
		total: 79.99
	},
	{
		id: 4,
		customer: 'Alice Brown',
		date: '2023-06-04',
		status: 'Pending',
		total: 199.99
	}
]

export default function OrdersPage() {
	return (
		<div className='space-y-8 container'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<h1 className='text-3xl font-bold'>Orders Management</h1>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
				</CardHeader>
				<CardContent className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map(order => (
								<TableRow key={order.id}>
									<TableCell>#{order.id}</TableCell>
									<TableCell>{order.customer}</TableCell>
									<TableCell>{order.date}</TableCell>
									<TableCell>
										<Badge
											variant={
												order.status === 'Completed'
													? 'default'
													: order.status === 'Processing'
													? 'secondary'
													: order.status === 'Shipped'
													? 'outline'
													: 'destructive'
											}
										>
											{order.status}
										</Badge>
									</TableCell>
									<TableCell>${order.total.toFixed(2)}</TableCell>
									<TableCell>
										<div className='flex flex-col sm:flex-row gap-2'>
											<Button
												variant='outline'
												size='sm'
											>
												View
											</Button>
											<Button
												variant='outline'
												size='sm'
											>
												Update
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
