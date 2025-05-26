import { ReviewCardListSkeleton } from '@/features/review/components/review-list'
import ReviewButton from './review-button'

export default async function ProductPageReviewsLoading() {
	return (
		<div className='container'>
			<div className='flex items-center justify-between gap-4 mb-8'>
				<h2 className='text-2xl font-bold'>All Reviews</h2>

				<ReviewButton disabled />
			</div>

			<ReviewCardListSkeleton />
		</div>
	)
}
