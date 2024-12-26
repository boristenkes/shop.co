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
import { MenuIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import Searchbar from './searchbar'

export default function Navbar() {
	return (
		<header className='container relative px-4 py-6 flex items-center justify-between'>
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

				<Link
					href='/cart'
					aria-label='Cart'
				>
					<ShoppingCartIcon className='size-6' />
				</Link>

				<UserButton />
			</div>
		</header>
	)
}
