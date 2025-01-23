import ErrorMessage from '@/components/error-message'
import { getReviews } from '@/features/review/actions'
import { columns } from './columns'
import { ReviewsTable } from './table'

export default async function ReviewsPage() {
	const response = await getReviews()

	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Reviews Management</h1>

			{response.success ? (
				<ReviewsTable
					data={response.reviews}
					columns={columns}
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}
		</div>
	)
}
