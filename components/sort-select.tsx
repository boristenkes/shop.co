'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'
import { Fragment, useState } from 'react'

export type SortSelectItem = {
	value: string
	label: string
}

type SortSelectProps = React.ComponentProps<typeof Select> & {
	items: SortSelectItem[]
}

export default function SortSelect({
	items,
	defaultValue = `${items[0].value}-asc`,
	...props
}: SortSelectProps) {
	const searchParams = useSearchParams()
	const [value, setValue] = useState(searchParams.get('sortby') ?? defaultValue)

	const handleSelect = (newValue: string) => {
		const params = new URLSearchParams(searchParams)
		params.set('sortby', newValue)
		history.replaceState(null, '', `?${params.toString()}`)

		setValue(newValue)
	}

	return (
		<Select
			{...props}
			value={value}
			onValueChange={handleSelect}
		>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select sorting method' />
			</SelectTrigger>
			<SelectContent>
				{items.map(item => (
					<Fragment key={item.value}>
						<SelectItem value={`${item.value}-asc`}>
							{item.label} - Ascending
						</SelectItem>
						<SelectItem value={`${item.value}-desc`}>
							{item.label} - Descending
						</SelectItem>
					</Fragment>
				))}
			</SelectContent>
		</Select>
	)
}
