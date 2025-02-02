import { Rating } from '@/components/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { MoreHorizontalIcon } from 'lucide-react'
import { GetProductReviewsReview } from '../actions'

export default function ReviewCard({
	review
}: {
	review: GetProductReviewsReview
}) {
	return (
		<article className='px-8 py-7 border rounded-2xl flex flex-col h-full'>
			<div className='flex items-center justify-between gap-2 mb-2'>
				<Rating rating={review.rating} />
				<MoreHorizontalIcon className='text-neutral-600' />
			</div>

			<h3 className='font-bold text-xl mb-2'>{review.user.name}</h3>

			<p className='text-gray-600 text-base mb-6 flex-grow'>
				<q>{review.comment}</q>
			</p>

			<p className='font-medium text-neutral-600'>
				Posted on{' '}
				<time dateTime={review.createdAt?.toISOString()}>
					{formatDate(review.createdAt!, {
						month: 'long',
						day: '2-digit',
						year: 'numeric'
					})}
				</time>
			</p>
		</article>
	)
}

export function ReviewCardSkeleton() {
	return (
		<>
			<div className='flex items-center justify-between gap-2 mb-2'>
				<Skeleton className='w-[120px] h-6 rounded-sm' />
				<Skeleton className='w-6 h-2 rounded-sm' />
			</div>

			<Skeleton className='h-6 w-32 rounded-sm mb-4' />

			<div className='mb-6 space-y-1'>
				<Skeleton className='w-11/12 h-4 rounded-sm' />
				<Skeleton className='w-11/12 h-4 rounded-sm' />
				<Skeleton className='w-1/2 h-4 rounded-sm' />
			</div>

			<Skeleton className='w-52 h-6 rounded-sm' />
		</>
	)
}
