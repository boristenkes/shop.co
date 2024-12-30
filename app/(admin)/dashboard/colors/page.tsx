import ErrorMessage from '@/components/error-message'
import { getColors } from '@/features/color/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { notFound } from 'next/navigation'
import { ColorsTable } from './colors-table'
import { columns } from './columns'
import NewColorButton from './components'

const colors = [
	{ id: 1, name: 'Red', hex: '#FF0000' },
	{ id: 2, name: 'Blue', hex: '#0000FF' },
	{ id: 3, name: 'Green', hex: '#00FF00' }
]

export default async function ColorsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, 'colors', ['read']))
		notFound()

	const response = await getColors()

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold flex items-center gap-2'>
					Colors Management
				</h1>
				{hasPermission(currentUser.role!, 'colors', ['create']) && (
					<NewColorButton />
				)}
			</div>

			{response.success ? (
				<ColorsTable
					columns={columns}
					data={response.colors}
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}

			{/* <Card>
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
			</Card> */}
		</div>
	)
}
