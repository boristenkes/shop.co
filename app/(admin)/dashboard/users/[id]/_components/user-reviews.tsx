import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Button } from '@/components/ui/button'
import { User } from '@/db/schema/users'
import { getUserReviews } from '@/features/review/actions/read'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function UserReviews({ userId }: { userId: User['id'] }) {
	const response = await getUserReviews(userId)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const { reviews } = response
	const hasReviews = reviews.length > 0

	if (!hasReviews)
		return (
			<p className='text-center py-8'>This user did not post any reviews.</p>
		)

	return (
		<ul className='space-y-4'>
			{reviews.map(review => (
				<li
					key={review.id}
					className='flex items-center justify-between'
				>
					<div className='flex items-start gap-4'>
						<Link
							href={`/products/${review.product.slug}/${review.product.id}/reviews`}
							className='bg-stone-100 rounded-sm shrink-0'
						>
							<Image
								src={review.product.images[0].url}
								alt={review.product.name}
								width={80}
								height={80}
								className='size-20 object-contain'
							/>
						</Link>
						<div className='space-y-2'>
							<div className='flex items-center justify-between gap-2'>
								<Link
									href={`/products/${review.product.slug}/${review.product.id}/reviews`}
								>
									<h3 className='font-semibold'>{review.product.name}</h3>
								</Link>

								{review.approved ? (
									<p className='flex items-center gap-2'>
										Approved <CheckIcon className='size-4' />
									</p>
								) : (
									<Button size='sm'>Approve</Button>
								)}
							</div>

							<q>{review.comment}</q>
							<Rating rating={review.rating} />
						</div>
					</div>
				</li>
			))}
		</ul>
	)
}
