import { brands } from '@/constants'
import Image from 'next/image'

export default function Brands() {
	return (
		<div className='h-full bg-neutral-950 grow py-11 w-full'>
			<ul className='container flex h-full items-center justify-center gap-12 flex-wrap'>
				{brands.map(brand => (
					<li key={brand.name}>
						<a
							href={brand.href}
							aria-label={brand.name}
							target='_blank'
							rel='noreferrer'
						>
							<Image
								src={brand.image}
								alt={brand.name}
							/>
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}
