'use client'

import * as Slider from '@radix-ui/react-slider'
import { useState } from 'react'

export default function PriceRangeSlider() {
	const [value, setValue] = useState([500, 4500])

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-2'>
				<h3 className='text-lg font-bold'>Price</h3>
				<output
					suppressHydrationWarning
					className='text-sm font-medium tabular-nums'
				>
					${value[0].toLocaleString()} - ${value[1].toLocaleString()}
				</output>
			</div>
			<Slider.Root
				min={10}
				max={5000}
				value={value}
				onValueChange={setValue}
				className='relative flex w-full touch-none select-none items-center'
			>
				<Slider.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800'>
					<Slider.Range className='absolute h-full bg-zinc-900 dark:bg-zinc-50' />
				</Slider.Track>
				<Slider.Thumb
					name='min'
					className='block h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300'
				/>
				<Slider.Thumb
					name='max'
					className='block h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300'
				/>
			</Slider.Root>
		</div>
	)
}
