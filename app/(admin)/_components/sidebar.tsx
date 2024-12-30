import NavLink from '@/components/utils/nav-links'
import { signOut } from '@/lib/auth'
import {
	Home,
	HomeIcon,
	LogOutIcon,
	Palette,
	ShoppingBag,
	ShoppingBasket,
	ShoppingCart,
	Star,
	Tag,
	Users
} from 'lucide-react'
import Link from 'next/link'

const navItems = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Users', href: '/dashboard/users', icon: Users },
	{ name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
	{ name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
	{ name: 'Carts', href: '/dashboard/carts', icon: ShoppingBasket },
	{ name: 'Reviews', href: '/dashboard/reviews', icon: Star },
	{ name: 'Categories', href: '/dashboard/categories', icon: Tag },
	{ name: 'Colors', href: '/dashboard/colors', icon: Palette }
]

export function Sidebar() {
	return (
		<div className='flex flex-col w-64 bg-white border-r'>
			<div className='flex items-center justify-center h-16 border-b'>
				<span className='text-2xl font-semibold'>Admin Dashboard</span>
			</div>
			<nav className='flex-1 overflow-y-auto'>
				<ul className='p-4 space-y-2'>
					{navItems.map(item => (
						<li key={item.name}>
							<NavLink
								href={item.href}
								className='flex items-center p-2 text-gray-700 rounded hover:bg-gray-100'
								activeStyles='bg-gray-100'
							>
								<item.icon className='w-5 h-5 mr-3' />
								{item.name}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className='mt-auto'>
				<ul className='p-4'>
					<li>
						<Link
							href='/'
							className='flex items-center p-2 text-gray-700 rounded hover:bg-gray-100'
						>
							<HomeIcon className='w-5 h-5 mr-3' />
							Home
						</Link>
					</li>
					<li>
						<form
							action={async () => {
								'use server'
								await signOut({ redirectTo: '/' })
							}}
						>
							<button className='flex items-center p-2 text-gray-700 w-full rounded hover:bg-gray-100'>
								<LogOutIcon className='w-5 h-5 mr-3' />
								Log out
							</button>
						</form>
					</li>
				</ul>
			</div>
		</div>
	)
}
