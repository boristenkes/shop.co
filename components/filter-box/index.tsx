import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SlidersHorizontalIcon } from 'lucide-react'
import Form from 'next/form'
import ColorsFilter from './colors-filter'
import PriceRangeSlider from './price-range'
import SizeFilter from './size-filter'

export default function FilterBox() {
	return (
		<aside className='p-6 rounded-3xl border min-w-72 h-fit'>
			<div className='flex items-center justify-between gap-4'>
				<h2 className='text-xl font-bold'>Filters</h2>
				<SlidersHorizontalIcon className='size-4 text-neutral-600' />
			</div>
			<Separator className='my-6' />
			<Form action=''>
				<PriceRangeSlider />
				<Separator className='my-6' />
				<ColorsFilter />
				<Separator className='my-6' />
				<SizeFilter />
				<Button
					size='lg'
					className='w-full mt-6'
				>
					Apply Filter
				</Button>
			</Form>
		</aside>
	)
}
