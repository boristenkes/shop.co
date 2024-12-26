import Logo from '@/components/icons/logo'
import Searchbar from '@/components/searchbar'
import { Button } from '@/components/ui/button'
import UserButton from '@/components/user-button'
import { brands, navLinks } from '@/constants'
import { integralCf } from '@/lib/fonts'
import { ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<div>
			<div className='min-h-[100dvh] flex flex-col'>
				<header className='container py-6 flex items-center justify-between'>
					<div className='flex items-center gap-12'>
						<Link
							href='/'
							aria-label='Home'
						>
							<Logo />
						</Link>

						<nav>
							<ul className='flex items-center gap-6'>
								{navLinks.map(link => (
									<li key={link.href}>
										<Link href={link.href}>{link.title}</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>

					<div className='flex items-center gap-6'>
						<Searchbar />
						<Link
							href='/cart'
							aria-label='Cart'
						>
							<ShoppingCartIcon className='size-6' />
						</Link>
						<UserButton />
					</div>
				</header>

				<div className='bg-[#f3f0f1] grow flex items-end max-xl:flex-col'>
					<header className='container relative flex items-center justify-around'>
						<div className='space-y-8 -translate-y-16'>
							<h1
								className={`${integralCf.className} text-neutral-900 uppercase font-bold text-7xl text-balance`}
							>
								Find clothes that matches your style
							</h1>
							<p className='text-balance text-base'>
								Browse through our diverse range of meticulously crafted
								garments, designed to bring out your individuality and cater to
								your sense of style.
							</p>
							<Button size='lg'>Show Now</Button>

							<div className='flex items-center gap-4 space-x-8 flex-wrap'>
								<div>
									<p className='font-semibold text-4xl'>200+</p>
									<p className='text-gray-700'>International Brands</p>
								</div>
								<div>
									<p className='font-semibold text-4xl'>2,000+</p>
									<p className='text-gray-700'>High-Quality Products</p>
								</div>
								<div>
									<p className='font-semibold text-4xl'>30,000+</p>
									<p className='text-gray-700'>Happy Customers</p>
								</div>
							</div>
						</div>

						<Image
							src='/assets/images/hero.png'
							width={500}
							height={600}
							alt=''
							className='inset-0 object-cover size-full'
						/>
					</header>
				</div>
			</div>
			<div className='h-full bg-neutral-950 grow grid place-content-center py-11'>
				<ul className='flex h-full items-center justify-center gap-16 flex-wrap'>
					{brands.map(brand => (
						<li key={brand.name}>
							<Image
								src={brand.image}
								alt={brand.name}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
