import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getProductPriceMinMax } from '@/features/product/actions'
import { cn } from '@/lib/utils'
import { SlidersHorizontalIcon } from 'lucide-react'
import Form from 'next/form'
import CategoryFilter from './category-filter'
import ColorsFilter from './colors-filter'
import PriceRangeSlider from './price-range'
import SizeFilter from './size-filter'

type FilterBoxProps = React.ComponentProps<'aside'>

export default async function FilterBox({
	className,
	...props
}: FilterBoxProps) {
	const response = await getProductPriceMinMax()
	const priceRange = response.success
		? [
				Math.floor(response.minmax.min / 100),
				Math.ceil(response.minmax.max / 100)
		  ]
		: [10, 5000]

	return (
		<aside
			className={cn('p-6 rounded-3xl border w-72 h-fit', className)}
			{...props}
		>
			<div className='flex items-center justify-between gap-4'>
				<h2 className='text-xl font-bold'>Filters</h2>
				<SlidersHorizontalIcon className='size-4 text-neutral-600' />
			</div>
			<Separator className='my-6' />
			<Form action=''>
				<PriceRangeSlider priceRange={priceRange} />
				<Separator className='my-6' />
				<ColorsFilter />
				<Separator className='my-6' />
				<SizeFilter />
				<Separator className='my-6' />
				<CategoryFilter />
				<Button
					size='lg'
					className='w-full mt-8'
				>
					Apply Filters
				</Button>
			</Form>
		</aside>
	)
}
