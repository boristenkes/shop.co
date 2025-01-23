'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
	{
		href: '',
		title: 'Product Details'
	},
	{
		href: '/reviews',
		title: 'Rating & Reviews'
	},
	{
		href: '/faq',
		title: 'FAQs'
	}
]

export default function ProductPageTabs({
	slug,
	id
}: {
	slug: string
	id: string
}) {
	const pathname = usePathname()

	return (
		<div className='container flex items-center text-lg py-10 overflow-x-auto'>
			{tabs.map(tab => {
				const href = `/products/${slug}/${id}${tab.href}`

				return (
					<Link
						key={tab.title}
						href={href}
						className={cn(
							'flex-1 text-center py-4 px-6 border-b-2 hover:bg-gray-50 transition-colors whitespace-nowrap',
							{
								'border-b-neutral-900 font-medium': href === pathname
							}
						)}
					>
						{tab.title}
					</Link>
				)
			})}
		</div>
	)
}
