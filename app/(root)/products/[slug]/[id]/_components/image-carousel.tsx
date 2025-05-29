'use client'

import {
	Carousel,
	CarouselMainContainer,
	CarouselThumbsContainer,
	SliderMainItem,
	SliderThumbItem
} from '@/components/ui/ext/carousel'
import { ProductImage } from '@/db/schema/product-images'
import useMediaQuery from '@/hooks/use-media-query'
import Image from 'next/image'

export default function ImageCarousel({
	images
}: {
	images: Pick<ProductImage, 'id' | 'url'>[]
}) {
	const isMobile = useMediaQuery('(max-width: 1024px)')

	return (
		<Carousel
			orientation={isMobile ? 'horizontal' : 'vertical'}
			className='flex items-center basis-1/2 flex-col lg:flex-row-reverse gap-2'
		>
			<div className='relative basis-3/4 bg-stone-100'>
				<CarouselMainContainer className='h-[30rem]'>
					{images.map((image, idx) => (
						<SliderMainItem
							key={image.id}
							className='border border-muted flex items-center justify-center h-full rounded-md'
						>
							<Image
								src={image.url}
								alt=''
								width={384}
								height={384}
								className='size-full object-contain'
								priority={idx === 0}
							/>
						</SliderMainItem>
					))}
				</CarouselMainContainer>
			</div>
			<CarouselThumbsContainer className='lg:h-80 basis-1/4 rounded-md'>
				{images.map((image, idx) => (
					<SliderThumbItem
						key={image.id}
						index={idx}
						className='bg-transparent size-24 aspect-square bg-stone-100 cursor-pointer'
					>
						<Image
							src={image.url}
							alt=''
							width={196}
							height={196}
							className='object-contain aspect-square size-full'
						/>
					</SliderThumbItem>
				))}
			</CarouselThumbsContainer>
		</Carousel>
	)
}
