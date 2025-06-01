import Logo from '@/components/icons/logo'
import LogoutButton from '@/components/utils/logout-button'
import NavLink from '@/components/utils/nav-links'
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
	Ticket,
	Users
} from 'lucide-react'
import Link from 'next/link'

const navItems = [
	{ name: 'Dashboard', href: '/dashboard', icon: Home },
	{ name: 'Users', href: '/dashboard/users', icon: Users },
	{ name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
	{ name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
	{ name: 'Carts', href: '/dashboard/carts', icon: ShoppingBasket },
	{ name: 'Coupons', href: '/dashboard/coupons', icon: Ticket },
	{ name: 'Reviews', href: '/dashboard/reviews', icon: Star },
	{ name: 'Categories', href: '/dashboard/categories', icon: Tag },
	{ name: 'Colors', href: '/dashboard/colors', icon: Palette }
]

export function Sidebar() {
	return (
		<div className='sticky top-0 shrink-0 h-screen flex flex-col w-64 bg-white border-r'>
			<Link
				href='/'
				className='grid place-items-center py-4 border-b'
			>
				<Logo width={96} />
			</Link>

			<nav className='flex-1 overflow-y-auto'>
				<ul className='p-4 space-y-2'>
					{navItems.map(item => (
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
						<LogoutButton redirectTo='/'>
							<button className='flex items-center p-2 text-gray-700 w-full rounded hover:bg-gray-100'>
								<LogOutIcon className='w-5 h-5 mr-3' />
								Log out
							</button>
						</LogoutButton>
					</li>
				</ul>
			</div>
		</div>
	)
}
