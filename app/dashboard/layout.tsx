import { Menu } from 'lucide-react'
import Link from 'next/link'

import Logo from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import UserButton from '@/components/user-button'

import { ThemeToggle } from '@/components/theme-toggle'
import { dashboardNavLinks } from '@/constants'
import { Metadata } from 'next'
import NavLink from './_components/nav-link'

export const metadata: Metadata = {
	title: 'Dashboard'
}

export default function AdminLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className='bg-muted/10 flex min-h-screen w-full flex-col'>
			<header className='sticky top-0 flex h-16 items-center justify-between w-full bg-red-500 gap-4 border-b px-4 md:px-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-sm'>
				<nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
					<Link
						href='/'
						className='flex items-center gap-2 text-lg font-semibold md:text-base'
					>
						<Logo width={70} />
					</Link>

					{dashboardNavLinks.map(link => (
						<NavLink
							key={link.href}
							href={link.href}
						>
							{link.title}
						</NavLink>
					))}
				</nav>

				<div className='flex items-center gap-2'>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								className='shrink-0 md:hidden'
							>
								<Menu className='h-5 w-5' />
								<span className='sr-only'>Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='bg-white/80 dark:bg-black/80 backdrop-blur-sm'
						>
							<nav className='grid gap-6 text-lg font-medium'>
								<Link href='/'>
									<Logo width={70} />
								</Link>

								{dashboardNavLinks.map(link => (
									<NavLink
										key={link.href}
										href={link.href}
									>
										{link.title}
									</NavLink>
								))}
							</nav>
						</SheetContent>
					</Sheet>

					<ThemeToggle />

					<UserButton />
				</div>
			</header>
			{children}
		</div>
	)
}
