'use client'

import { Color } from '@/db/schema/colors'
import { darkenHex } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ColorCheckbox({ color }: { color: Color }) {
	const searchParams = useSearchParams()
	const defaultChecked = searchParams.getAll('color').includes(color.slug)
	const [checked, setChecked] = useState(defaultChecked)

	return (
		<label
			style={{
				backgroundColor: color.hexCode,
				borderColor: darkenHex(color.hexCode, 30)
			}}
			className='relative size-9 rounded-full inline-block border-2 cursor-pointer'
			aria-label={color.name}
		>
			<input
				checked={checked}
				onChange={e => setChecked(e.target.checked)}
				hidden
				type='checkbox'
				name='color'
				value={color.slug}
			/>
			{checked && (
				<CheckIcon className='absolute inset-0 m-auto size-4 text-white' />
			)}
		</label>
	)
}
