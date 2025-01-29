import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react'
import ReviewButton from './review-button'

export default async function ProductPageReviewsLoading() {
	return (
		<div className='container'>
			{/* <p className='p-16 text-center'>
				This product doesn&apos;t have any reviews
			</p> */}

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

			<ul className='grid grid-cols-1 md:grid-cols-2  gap-5'>
				{Array.from({ length: 6 }).map((_, idx) => (
					<li
						key={idx}
						className='px-8 py-7 border rounded-2xl'
					>
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
					</li>
				))}
			</ul>
		</div>
	)
}
