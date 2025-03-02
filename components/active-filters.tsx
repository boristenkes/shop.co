'use client'

import { cn, unslugify } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'

type ActiveFiltersProps = React.ComponentProps<'ul'> & {
	targetKeys?: string[]
}

type Filter = {
	key: string
	value: string
}

export default function ActiveFilters({
	targetKeys = ['min', 'max', 'color', 'size', 'category'],
	className,
	...props
}: ActiveFiltersProps) {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const filters: Filter[] = Array.from(searchParams.entries())
		.filter(([key]) => targetKeys.includes(key))
		.map(([key, value]) => ({ key, value }))

	const removeFilter = (filter: Filter) => {
		const newSearchParams = new URLSearchParams(searchParams)
		const filterValues = newSearchParams.getAll(filter.key)
		const updatedValues = filterValues.filter(value => value !== filter.value)

		if (updatedValues.length > 0) {
			newSearchParams.delete(filter.key)
			updatedValues.forEach(value => newSearchParams.append(filter.key, value))
		} else {
			newSearchParams.delete(filter.key)
		}

		history.replaceState(null, '', `?${newSearchParams.toString()}`)
	}

	return (
		filters.length > 0 && (
			<ul
				className={cn('flex items-center gap-2 flex-wrap', className)}
				{...props}
			>
				{filters.map((filter, index) => (
					<li
						key={index}
						className='flex items-center gap-2 bg-slate-100 py-1 px-2 rounded-lg capitalize shadow-sm'
					>
						<button
							onClick={() => removeFilter(filter)}
							aria-label={`Remove filter for ${filter.value}`}
						>
							<XIcon className='size-4' />
						</button>
						{filter.key}:{' '}
						<span className='font-medium'>
							{filter.key === 'size'
								? filter.value.toUpperCase()
								: unslugify(filter.value)}
						</span>
					</li>
				))}

				<li>
					<button
						className='flex items-center gap-2 py-1 px-2 underline'
						onClick={() => history.replaceState(null, '', pathname)}
					>
						Clear filters
					</button>
				</li>
			</ul>
		)
	)
}
