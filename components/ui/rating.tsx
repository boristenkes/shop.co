'use client'

import { cn } from '@/lib/utils'
import { Heart, Star, ThumbsUp } from 'lucide-react'
import { forwardRef, useState } from 'react'

const iconMap = {
	star: Star,
	heart: Heart,
	thumbsUp: ThumbsUp
}

const sizeMap = {
	sm: 'w-4 h-4',
	md: 'w-6 h-6',
	lg: 'w-8 h-8'
}

export type RatingProps = {
	value: number
	onChange?: (value: number) => void
	max?: number
	icon?: keyof typeof iconMap
	size?: keyof typeof sizeMap
	readOnly?: boolean
	className?: string
	style?: React.CSSProperties
}

export const RatingInput = forwardRef<HTMLDivElement, RatingProps>(
	(
		{
			value,
			onChange,
			max = 5,
			icon = 'star',
			size = 'md',
			readOnly = false,
			className,
			...props
		},
		ref
	) => {
		const [hoverValue, setHoverValue] = useState<number | null>(null)
		const Icon = iconMap[icon]

		const handleMouseEnter = (index: number) => {
			if (!readOnly) {
				setHoverValue(index)
			}
		}

		const handleMouseLeave = () => {
			setHoverValue(null)
		}

		const handleClick = (index: number) => {
			if (!readOnly && onChange) {
				onChange(index)
			}
		}

		return (
			<div
				ref={ref}
				className={cn('flex items-center', className)}
				{...props}
			>
				{[...Array(max)].map((_, index) => {
					const filled = (hoverValue !== null ? hoverValue : value) > index

					return (
						<Icon
							key={index}
							className={cn(
								sizeMap[size],
								'cursor-pointer transition-colors',
								filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300',
								readOnly && 'cursor-default opacity-50'
							)}
							onMouseEnter={() => handleMouseEnter(index + 1)}
							onMouseLeave={handleMouseLeave}
							onClick={() => handleClick(index + 1)}
							aria-hidden={readOnly}
							role={readOnly ? undefined : 'button'}
							tabIndex={readOnly ? -1 : 0}
							aria-label={`Rate ${index + 1} out of ${max}`}
						/>
					)
				})}
			</div>
		)
	}
)

RatingInput.displayName = 'RatingInput'
