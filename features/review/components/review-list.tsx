import { GetProductReviewsReview } from '../actions'
import ReviewCard, { ReviewCardSkeleton } from './review-card'

export default function ReviewList({
	reviews
}: {
	reviews: GetProductReviewsReview[]
}) {
	return (
		<ul className='grid grid-cols-1 md:grid-cols-2 gap-5'>
			{reviews.map(review => (
				<li key={review.id}>
					<ReviewCard review={review} />
				</li>
			))}
		</ul>
	)
}

export function ReviewCardListSkeleton({ length = 6 }: { length?: number }) {
	return (
		<ul className='grid grid-cols-1 md:grid-cols-2  gap-5'>
			{Array.from({ length }).map((_, idx) => (
				<li
					key={idx}
					className='px-8 py-7 border rounded-2xl'
				>
					<ReviewCardSkeleton />
				</li>
			))}
		</ul>
	)
}
