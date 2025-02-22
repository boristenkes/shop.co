import { cn } from '@/lib/utils'
import StarEmpty from './icons/star-empty'
import StarFull from './icons/star-full'
import StarHalf from './icons/star-half'

type RatingProps = React.ComponentProps<'div'> & {
	rating: number // 1-5 scale
}

export function Rating({ rating, className, ...props }: RatingProps) {
	const fullStars = Math.floor(+rating)
	const hasHalfStar = +rating % 1 >= 0.5
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

	return (
		<div
			className={cn('flex space-x-1', className)}
			aria-label={`Rating: ${rating.toFixed(1)}/5`}
			{...props}
		>
			{/* Full stars */}
			{Array.from({ length: fullStars }).map((_, idx) => (
				<StarFull
					key={`full-${idx}`}
					className='text-yellow-500'
				/>
			))}

			{/* Half star */}
			{hasHalfStar && <StarHalf className='text-yellow-500' />}

			{/* Empty stars */}
			{Array.from({ length: emptyStars }).map((_, idx) => (
				<StarEmpty
					key={`empty-${idx}`}
					className='text-yellow-500'
				/>
			))}
		</div>
	)
}
