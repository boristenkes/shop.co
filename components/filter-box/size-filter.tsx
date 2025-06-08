'use client'

import { Size, sizes } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SizeFilter() {
	const searchParams = useSearchParams()
	const [selectedSizes, setSelectedSizes] = useState<Size[]>(
		searchParams.getAll('size') as Size[]
	)

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-bold'>Sizes</h3>

			<ul className='flex flex-wrap gap-2'>
				{sizes.map(size => (
					<label
						key={size}
						className={cn(
							'border py-2 px-4 rounded-full text-center cursor-pointer transition-colors font-medium',
							selectedSizes.includes(size)
								? 'bg-neutral-900 text-neutral-100'
								: 'hover:bg-neutral-100'
						)}
						aria-label={size}
					>
						<input
							type='checkbox'
							value={size}
							name='size'
							onChange={e =>
								setSelectedSizes(prev =>
									e.target.checked
										? [...prev, size]
										: prev.filter(s => s !== size)
								)
							}
							checked={selectedSizes.includes(size)}
							hidden
						/>
						{size}
					</label>
				))}
			</ul>
		</div>
	)
}
