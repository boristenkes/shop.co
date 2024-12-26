import Star from '@/components/icons/star'
import { Button } from '@/components/ui/button'
import { integralCf } from '@/lib/fonts'
import Image from 'next/image'

export default function Hero() {
	return (
		<div className='bg-gray-100 grow flex items-end max-xl:flex-col'>
			<header className='container relative flex max-xl:flex-col items-end justify-around gap-8'>
				<div className='space-y-8 xl:-translate-y-16 px-4 max-xl:mt-16'>
					<h1
						className={`${integralCf.className} text-neutral-900 uppercase font-bold text-4xl lg:text-5xl xl:text-7xl text-balance`}
					>
						Find clothes that matches your style
					</h1>
					<p className='text-balance text-base text-gray-600'>
						Browse through our diverse range of meticulously crafted garments,
						designed to bring out your individuality and cater to your sense of
						style.
					</p>

					<Button size='lg'>Shop Now</Button>

					<div className='flex items-center max-md:justify-center gap-4 space-x-8 flex-wrap pt-8'>
						<div>
							<p className='font-semibold lg:font-bold text-2xl lg:text-4xl'>
								200+
							</p>
							<p className='text-gray-600'>International Brands</p>
						</div>
						<div>
							<p className='font-semibold lg:font-bold text-2xl lg:text-4xl'>
								2,000+
							</p>
							<p className='text-gray-600'>High-Quality Products</p>
						</div>
						<div>
							<p className='font-semibold lg:font-bold text-2xl lg:text-4xl'>
								30,000+
							</p>
							<p className='text-gray-600'>Happy Customers</p>
						</div>
					</div>
				</div>

				<div className='relative size-full'>
					<Image
						src='/assets/images/hero.png'
						width={500}
						height={600}
						priority
						alt=''
						className='size-full'
					/>
					<Star className='absolute top-1 right-8 size-32' />
					<Star className='absolute top-1/3 left-4 size-16' />
				</div>
			</header>
		</div>
	)
}
