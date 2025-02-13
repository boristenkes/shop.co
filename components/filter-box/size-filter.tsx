'use client'

import { Size, TSize } from '@/db/schema/enums'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SizeFilter() {
	const allSizes = Object.values(Size)
	const searchParams = useSearchParams()
	const [sizes, setSizes] = useState<TSize[]>(
		searchParams.getAll('size') as TSize[]
	)

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-bold'>Sizes</h3>

			<ul className='grid grid-cols-4 gap-2'>
				{allSizes.map(size => (
					<label
						key={size}
						className={cn(
							'border p-2 rounded-full text-center cursor-pointer transition-colors font-medium',
							{
								'bg-neutral-900 text-neutral-100': sizes.includes(size)
							}
						)}
						aria-label={size}
					>
						<input
							type='checkbox'
							value={size}
							name='size'
							onChange={e =>
								setSizes(
									e.target.checked
										? [...sizes, size]
										: sizes.filter(s => s !== size)
								)
							}
							checked={sizes.includes(size)}
							hidden
						/>
						{size}
					</label>
				))}
			</ul>
		</div>
	)
}
