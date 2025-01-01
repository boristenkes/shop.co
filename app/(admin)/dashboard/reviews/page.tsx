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
import { Star } from 'lucide-react'

const reviews = [
	{
		id: 1,
		product: 'T-Shirt',
		user: 'John Doe',
		rating: 4,
		comment: 'Great product!'
	},
	{
		id: 2,
		product: 'Jeans',
		user: 'Jane Smith',
		rating: 5,
		comment: 'Perfect fit!'
	},
	{
		id: 3,
		product: 'Sneakers',
		user: 'Bob Johnson',
		rating: 3,
		comment: 'Comfortable but a bit pricey.'
	}
]

export default function ReviewsPage() {
	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Reviews Management</h1>
			<Card>
				<CardHeader>
					<CardTitle>Reviews</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Comment</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reviews.map(review => (
								<TableRow key={review.id}>
									<TableCell>{review.product}</TableCell>
									<TableCell>{review.user}</TableCell>
									<TableCell>
										<div className='flex'>
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-4 h-4 ${
														i < review.rating
															? 'text-yellow-400 fill-current'
															: 'text-gray-300'
													}`}
												/>
											))}
										</div>
									</TableCell>
									<TableCell>{review.comment}</TableCell>
									<TableCell>
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
