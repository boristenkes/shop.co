'use client'

import Logo from '@/components/icons/logo'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import NavLink from '@/components/utils/nav-links'
import { adminNavItems } from '@/constants'
import { HomeIcon, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NavbarLinks() {
	const [open, setOpen] = useState(true)
	const pathname = usePathname()

	useEffect(() => setOpen(false), [pathname])

	return (
		<Sheet
			open={open}
			onOpenChange={setOpen}
		>
			<SheetTrigger>
				<MenuIcon />
			</SheetTrigger>
			<SheetContent side='right'>
				<SheetHeader>
					<SheetTitle>
						<Logo className='mx-auto w-24' />
					</SheetTitle>
					<SheetDescription className='sr-only'>
						Navigate through admin dashboard using links below
					</SheetDescription>
				</SheetHeader>

				<nav className='flex-1 overflow-y-auto mt-8 h-full'>
					<ul className='p-4 space-y-2 flex flex-col h-full'>
						{adminNavItems.map(item => (
							<li key={item.name}>
								<NavLink
									href={item.href}
									className='flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition-colors'
									activeStyles='bg-gray-100 text-blue-600'
								>
									<item.icon className='w-5 h-5 mr-3' />
									{item.name}
								</NavLink>
							</li>
						))}
						<li className='h-full flex items-end pb-10'>
							<NavLink
								href='/'
								className='w-full flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition-colors'
								activeStyles='bg-gray-100 text-blue-600'
							>
								<HomeIcon className='w-5 h-5 mr-3' />
								Home
							</NavLink>
						</li>
					</ul>
				</nav>
			</SheetContent>
		</Sheet>
	)
}
