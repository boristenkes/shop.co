import StarFull from './icons/star-full'
import StarHalf from './icons/star-half'

type RatingProps = {
	rating: number // 1-10 scale
}

export function Rating({ rating }: RatingProps) {
	const fullStars = Math.floor(+rating)
	const hasHalfStar = +rating % 1 >= 0.5

	return (
		<div className='flex space-x-1'>
			{/* Full stars */}
			{Array.from({ length: fullStars }).map((_, idx) => (
				<StarFull
					key={`full-${idx}`}
					className='text-yellow-500'
				/>
			))}

			{/* Half star */}
			{hasHalfStar && <StarHalf className='text-yellow-500' />}
		</div>
	)
}
