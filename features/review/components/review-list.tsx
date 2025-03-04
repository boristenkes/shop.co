import { GetProductReviewsReview } from '@/features/review/actions/read'
import { cn } from '@/lib/utils'
import ReviewCard, { ReviewCardSkeleton } from './review-card'

type ReviewListProps = React.ComponentProps<'ul'> & {
	reviews: GetProductReviewsReview[]
}

export default function ReviewList({
	reviews,
	className,
	...props
}: ReviewListProps) {
	return (
		<ul
			className={cn('grid grid-cols-1 md:grid-cols-2 gap-5', className)}
			{...props}
		>
			{reviews.map(review => (
				<li key={review.id}>
					<ReviewCard review={review} />
				</li>
			))}
		</ul>
	)
}

type ReviewCardListSkeleton = Omit<ReviewListProps, 'reviews'> & {
	length?: number
}

export function ReviewCardListSkeleton({
	length = 6,
	className,
	...props
}: ReviewCardListSkeleton) {
	return (
		<ul
			className={cn('grid grid-cols-1 md:grid-cols-2  gap-5', className)}
			{...props}
		>
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
