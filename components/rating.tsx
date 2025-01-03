import StarFull from './icons/star-full'
import StarHalf from './icons/star-half'

type RatingProps = {
	rating: number // 1-10 scale
}

export function Rating({ rating }: RatingProps) {
	const normalizedRating = (rating / 2).toFixed(1) // Convert 1-10 to 0-5 scale
	const fullStars = Math.floor(+normalizedRating)
	const hasHalfStar = +normalizedRating % 1 >= 0.5

	return (
		<div className='flex items-center space-x-2'>
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
			<span className='text-gray-700 text-sm'>
				{normalizedRating}
				<span className='text-gray-400'>/5</span>
			</span>
		</div>
	)
}
