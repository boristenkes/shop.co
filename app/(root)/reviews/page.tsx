import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Button } from '@/components/ui/button'
import { getUserReviews } from '@/features/review/actions'
import DeleteReviewButton from '@/features/review/components/delete-review-button'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { cn, formatDate } from '@/lib/utils'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function UserReviewsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'reviews', ['read:own']))
		notFound()

	const response = await getUserReviews(currentUser.id)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const { reviews } = response
	const hasReviews = reviews.length > 0

	return (
		<main className='container py-16'>
			<h1 className='text-4xl font-semibold'>Your Reviews</h1>
			<p className='text-gray-500 mt-1 mb-12'>
				This is where you will find all reviews you left on our products.
			</p>

			{hasReviews ? (
				<ul className='grid grid-cols-1 md:grid-cols-2 gap-5'>
					{reviews.map(review => (
						<li
							key={review.id}
							className='flex gap-4 p-4 border rounded-2xl h-full'
						>
							<Link
								href={`/products/${review.product.slug}/${review.product.id}/reviews`}
								className='shrink-0'
							>
								<Image
									src={review.product.images[0].url}
									alt='Product image'
									width={100}
									height={100}
								/>
							</Link>
							<div className='w-full'>
								<div className='flex items-center justify-between gap-4 w-full'>
									<div className='flex items-center gap-4'>
										<h2 className='text-lg font-semibold mb-1'>
											<Link
												href={`/products/${review.product.slug}/${review.product.id}/reviews`}
											>
												{review.product.name}
											</Link>
										</h2>

										<p className='flex items-center gap-2'>
											<span
												className={cn(
													'inline-block size-2 rounded-full',
													review.approved ? 'bg-green-500' : 'bg-yellow-500'
												)}
											/>
											{review.approved ? 'Approved' : 'Waiting for approval'}
										</p>
									</div>

									<DeleteReviewButton reviewId={review.id}>
										<Button
											variant='ghost'
											className='size-11 rounded-lg'
										>
											<TrashIcon className='text-red-500 size-full' />
										</Button>
									</DeleteReviewButton>
								</div>

								<Rating
									rating={review.rating}
									className='mb-2'
								/>

								<p className='text-gray-600 text-base mb-4 flex-grow'>
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
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className='text-center py-16'>You didn&apos;t leave any reviews</p>
			)}
		</main>
	)
}
