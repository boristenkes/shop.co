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

const carts = [
	{
		id: 1,
		customer: 'John Doe',
		items: 3,
		lastUpdated: '2023-06-01',
		total: 99.99
	},
	{
		id: 2,
		customer: 'Jane Smith',
		items: 2,
		lastUpdated: '2023-06-02',
		total: 149.99
	},
	{
		id: 3,
		customer: 'Bob Johnson',
		items: 1,
		lastUpdated: '2023-06-03',
		total: 79.99
	},
	{
		id: 4,
		customer: 'Alice Brown',
		items: 4,
		lastUpdated: '2023-06-04',
		total: 199.99
	}
]

export default function CartsPage() {
	return (
		<div className='space-y-8 container'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<h1 className='text-3xl font-bold'>Carts Management</h1>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Active Carts</CardTitle>
				</CardHeader>
				<CardContent className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Cart ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Last Updated</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{carts.map(cart => (
								<TableRow key={cart.id}>
									<TableCell>#{cart.id}</TableCell>
									<TableCell>{cart.customer}</TableCell>
									<TableCell>{cart.items}</TableCell>
									<TableCell>{cart.lastUpdated}</TableCell>
									<TableCell>${cart.total.toFixed(2)}</TableCell>
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
												Edit
											</Button>
											<Button
												variant='destructive'
												size='sm'
											>
												Delete
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
