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

const colors = [
	{ id: 1, name: 'Red', hex: '#FF0000' },
	{ id: 2, name: 'Blue', hex: '#0000FF' },
	{ id: 3, name: 'Green', hex: '#00FF00' }
]

export default function ColorsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold flex items-center gap-2'>
					Colors Management
				</h1>
				<Button>Add Color</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Colors</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Hex Code</TableHead>
								<TableHead>Preview</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{colors.map(color => (
								<TableRow key={color.id}>
									<TableCell>{color.name}</TableCell>
									<TableCell>{color.hex}</TableCell>
									<TableCell>
										<div
											className='w-8 h-8 rounded'
											style={{ backgroundColor: color.hex }}
										></div>
									</TableCell>
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
				</CardContent>
			</Card>
		</div>
	)
}
