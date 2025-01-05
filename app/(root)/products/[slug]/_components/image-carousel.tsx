'use client'

import { ProductImage } from '@/db/schema/product-images.schema'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

export default function ImageCarousel({ images }: { images: ProductImage[] }) {
	const [currentIdx, setCurrentIdx] = useState(0)

	return (
		<div className='h-full flex gap-2'>
			<div className='flex flex-col overflow-y-auto h-full gap-1'>
				{images.map((image, idx) => (
					<button
						key={image.key}
						onClick={() => setCurrentIdx(idx)}
						className={cn(
							'border-2 border-transparent transition-colors rounded-2xl bg-stone-100',
							{
								'border-neutral-900': idx === currentIdx
							}
						)}
					>
						<Image
							src={image.url}
							alt=''
							width={100}
							height={100}
							className='object-contain size-28'
						/>
					</button>
				))}
			</div>
			<div className='bg-stone-100 rounded-lg w-fit'>
				<Image
					src={images[currentIdx].url}
					alt=''
					width={396}
					height={396}
				/>
			</div>
		</div>
	)
}
