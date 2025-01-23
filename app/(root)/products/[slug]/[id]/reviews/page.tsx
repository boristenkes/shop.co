import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { RatingInput } from '@/components/ui/rating'
import { getProductReviews } from '@/features/review/actions'
import { formatDate } from '@/lib/utils'
import {
	ChevronDownIcon,
	MoreHorizontalIcon,
	SlidersHorizontalIcon
} from 'lucide-react'
import ReviewButton from './review-button'

export default async function ProductPageReviews(props: {
	params: Promise<{ id: string }>
}) {
	const { id } = await props.params
	const response = await getProductReviews(Number(id))

	return (
		<div className='container'>
			<div className='flex items-center justify-between gap-4 mb-8'>
				<h2 className='text-2xl font-bold'>All Reviews</h2>

				<div className='flex items-center gap-2.5'>
					<Button
						size='icon'
						variant='secondary'
					>
						<SlidersHorizontalIcon />
					</Button>

					<Button variant='secondary'>
						Latest <ChevronDownIcon />
					</Button>

					<ReviewButton />
				</div>
			</div>

			{response.success ? (
				response.reviews.length > 0 ? (
					<ul className='grid grid-cols-1 md:grid-cols-2 gap-5'>
						{response.reviews.map(review => (
							<li
								key={review.id}
								className='px-8 py-7 border rounded-2xl'
							>
								<div className='flex items-center justify-between gap-2 mb-2'>
									<RatingInput
										readOnly
										value={review.rating}
									/>
									<MoreHorizontalIcon className='text-neutral-600' />
								</div>

								<h3 className='font-bold text-xl mb-2'>{review.user.name}</h3>

								<p className='text-gray-600 text-base mb-6'>
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
							</li>
						))}
					</ul>
				) : (
					<p className='p-16 text-center'>
						This product doesn&apos;t have any reviews
					</p>
				)
			) : (
				<ErrorMessage message={response.message} />
			)}
		</div>
	)
}
