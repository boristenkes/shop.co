import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { User } from '@/db/schema/users'
import { getUserReviews } from '@/features/review/actions'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type UserReviewsProps = React.ComponentProps<'div'> & {
	userId: User['id']
}

export default async function UserReviews({
	userId,
	...props
}: UserReviewsProps) {
	const response = await getUserReviews(userId)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const { reviews } = response
	const hasReviews = reviews.length > 0

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>User Reviews</CardTitle>
				<CardDescription>List of all reviews this user posted.</CardDescription>
			</CardHeader>
			<CardContent>
				{hasReviews ? (
					<ul className='space-y-4'>
						{reviews.map(review => (
							<li
								key={review.id}
								className='flex items-center justify-between'
							>
								<div className='flex items-start gap-4'>
									<Link
										href={`/products/${review.product.slug}/${review.product.id}/reviews`}
									>
										<Image
											src={review.product.images[0].url}
											alt={review.product.name}
											width={80}
											height={80}
										/>
									</Link>
									<div className='space-y-2'>
										<Link
											href={`/products/${review.product.slug}/${review.product.id}/reviews`}
										>
											<h3 className='font-semibold'>{review.product.name}</h3>
										</Link>

										<q>{review.comment}</q>
										<Rating rating={review.rating} />
									</div>
								</div>
								{review.approved ? (
									<p className='flex items-center gap-2'>
										Approved <CheckIcon className='size-4' />
									</p>
								) : (
									<Button size='sm'>Approve</Button>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className='text-center py-8'>
						This user did not post any reviews.
					</p>
				)}
			</CardContent>
		</Card>
	)
}
