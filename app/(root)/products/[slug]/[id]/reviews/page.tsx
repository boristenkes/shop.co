'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getProductReviews } from '@/features/review/actions/read'
import ReviewList, {
	ReviewCardListSkeleton
} from '@/features/review/components/review-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import ReviewButton from './review-button'

export default function ProductPageReviews() {
	const params = useParams()

	const query = useInfiniteQuery({
		queryKey: ['reviews:get', params.id],
		queryFn: ({ pageParam = 1 }) =>
			getProductReviews(Number(params.id), { page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length + 1 : undefined
	})

	const reviews = query.data?.pages.flatMap(page => page.reviews) ?? []
	const hasMore =
		query.data?.pages?.[query.data.pages.length - 1]?.hasMore ?? false

	return (
		<div className='container'>
			<div className='flex items-center justify-between gap-4 mb-8'>
				<h2 className='text-2xl font-bold'>All Reviews</h2>

				<ReviewButton />
			</div>

			{query.isLoading && <ReviewCardListSkeleton />}

			{query.isError && <ErrorMessage message='Something went wrong' />}

			{query.isSuccess &&
				(reviews.length > 0 ? (
					<>
						<ReviewList reviews={reviews} />

						{hasMore && (
							<Button
								variant='outline'
								size='lg'
								className='mx-auto mt-9 flex items-center gap-2'
								onClick={() => query.fetchNextPage()}
								disabled={query.isFetchingNextPage}
							>
								{query.isFetchingNextPage ? 'Loading' : 'Load More'}
								{query.isFetchingNextPage && (
									<Loader2Icon className='animate-spin' />
								)}
							</Button>
						)}
					</>
				) : (
					<p className='p-16 text-center'>
						This product doesn&apos;t have any reviews
					</p>
				))}
		</div>
	)
}
