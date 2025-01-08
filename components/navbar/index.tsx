import Logo from '@/components/icons/logo'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import UserButton from '@/components/user-button'
import { navLinks } from '@/constants'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import CartButton from './cart-button'
import Searchbar from './searchbar'

export default function Navbar() {
	return (
		<header className='sticky top-0 px-4 py-5 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm'>
			<div className='container flex items-center justify-between'>
				<div className='flex items-center gap-12'>
					<div className='flex items-center gap-4'>
						<Sheet>
							<SheetTrigger className='lg:hidden'>
								<MenuIcon />
							</SheetTrigger>
							<SheetContent side='left'>
								<SheetHeader>
									<SheetTitle>
										<Logo className='mx-auto w-24' />
									</SheetTitle>
								</SheetHeader>
								<nav className='mt-16'>
									<ul className='grid gap-6'>
										{navLinks.map(link => (
											<li key={link.href}>
												<Link href={link.href}>{link.title}</Link>
											</li>
										))}
									</ul>
								</nav>
							</SheetContent>
						</Sheet>

						<Link
							href='/'
							aria-label='Home'
						>
							<Logo />
						</Link>
					</div>

					<nav className='hidden lg:block'>
						<ul className='flex items-center gap-6'>
							{navLinks.map(link => (
								<li key={link.href}>
									<Link href={link.href}>{link.title}</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className='flex items-center gap-4'>
					<Searchbar />

					<CartButton />

					<UserButton />
				</div>
			</div>
		</header>
	)
}
