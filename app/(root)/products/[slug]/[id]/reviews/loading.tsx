import { Button } from '@/components/ui/button'
import { ReviewCardListSkeleton } from '@/features/review/components/review-list'
import { ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react'
import ReviewButton from './review-button'

export default async function ProductPageReviewsLoading() {
	return (
		<div className='container'>
			<div className='flex items-center justify-between gap-4 mb-8'>
				<h2 className='text-2xl font-bold'>All Reviews</h2>

				<div className='flex items-center gap-2.5'>
					<Button
						size='icon'
						variant='secondary'
						disabled
					>
						<SlidersHorizontalIcon />
					</Button>

					<Button
						variant='secondary'
						disabled
						className='max-md:hidden'
					>
						Latest <ChevronDownIcon />
					</Button>

					<ReviewButton disabled />
				</div>
			</div>

			<ReviewCardListSkeleton />
		</div>
	)
}
