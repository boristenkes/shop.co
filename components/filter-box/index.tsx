import { Separator } from '@/components/ui/separator'
import { getProductPriceMinMax } from '@/features/product/actions'
import { cn } from '@/lib/utils'
import { SlidersHorizontalIcon } from 'lucide-react'
import Form from 'next/form'
import SubmitButton from '../submit-button'
import { Skeleton } from '../ui/skeleton'
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
				<SubmitButton
					size='lg'
					className='w-full mt-8'
					pendingText='Filtering...'
				>
					Apply Filters
				</SubmitButton>
			</Form>
		</aside>
	)
}

export function FilterBoxSkeleton({ className, ...props }: FilterBoxProps) {
	return (
		<aside
			className={cn('p-6 rounded-3xl border w-72 h-fit', className)}
			{...props}
		>
			<div className='flex items-center justify-between gap-4'>
				<Skeleton className='w-14 h-6' />
				<Skeleton className='size-4 rounded-sm' />
			</div>
			<Separator className='my-6' />
			<div>
				<div className='space-y-4'>
					<div className='flex items-center justify-between gap-2'>
						<Skeleton className='w-24 h-5' />
						<Skeleton className='w-20 h-5' />
					</div>
					<Skeleton className='w-full h-2' />
				</div>

				<Separator className='my-6' />

				<div className='space-y-4'>
					<Skeleton className='w-14 h-6' />

					<ul className='flex flex-wrap gap-2'>
						{Array.from({ length: 10 }).map((_, idx) => (
							<li key={idx}>
								<Skeleton className='size-9 rounded-full' />
							</li>
						))}
					</ul>
				</div>

				<Separator className='my-6' />

				<div className='space-y-4'>
					<Skeleton className='w-12 h-6' />

					<ul className='flex flex-wrap gap-2'>
						{Array.from({ length: 7 }).map((_, idx) => (
							<li key={idx}>
								<Skeleton className='w-14 h-10 rounded-full' />
							</li>
						))}
					</ul>
				</div>

				<Separator className='my-6' />

				<div className='space-y-4'>
					<Skeleton className='w-24 h-6' />

					<ul className='flex flex-wrap gap-y-2'>
						{Array.from({ length: 6 }).map((_, idx) => (
							<li key={idx}>
								<Skeleton
									className='h-[38px] rounded-full'
									style={{
										width: Math.floor(Math.random() * 100) + 60 + 'px'
									}}
								/>
							</li>
						))}
					</ul>
				</div>

				<Skeleton className='w-full h-10 rounded-full mt-8' />
			</div>
		</aside>
	)
}
