'use client'

import { Category } from '@/db/schema/categories'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function CategoryCheckbox({
	category
}: {
	category: Category & { productCount: number }
}) {
	const searchParams = useSearchParams()
	const defaultChecked = searchParams.getAll('category').includes(category.slug)
	const [checked, setChecked] = useState(defaultChecked)

	return (
		<label
			className={cn(
				'border py-2 px-4 rounded-full text-center cursor-pointer transition-colors font-medium',
				checked ? 'bg-neutral-900 text-neutral-100' : 'hover:bg-neutral-100'
			)}
			aria-label={category.name}
		>
			<input
				checked={checked}
				onChange={e => setChecked(e.target.checked)}
				hidden
				type='checkbox'
				name='category'
				value={category.slug}
			/>
			{category.name}{' '}
			<small className='text-gray-600'>({category.productCount})</small>
		</label>
	)
}
