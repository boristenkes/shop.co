import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

const categories = [
	{ id: 1, name: 'Clothing', productCount: 50 },
	{ id: 2, name: 'Footwear', productCount: 30 },
	{ id: 3, name: 'Accessories', productCount: 20 }
]

export default async function CategoriesPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Categories Management</h1>
				<Button>Add Category</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Product Count</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.map(category => (
						<TableRow key={category.id}>
							<TableCell>{category.name}</TableCell>
							<TableCell>{category.productCount}</TableCell>
							<TableCell>
								<Button
									variant='outline'
									size='sm'
									className='mr-2'
								>
									Edit
								</Button>
								<Button
									variant='destructive'
									size='sm'
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
