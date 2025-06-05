import Logo from '@/components/icons/logo'
import LogoutButton from '@/components/utils/logout-button'
import NavLink from '@/components/utils/nav-links'
import { adminNavItems } from '@/constants'
import { HomeIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
	return (
		<div className='sticky top-0 shrink-0 h-screen hidden lg:flex flex-col w-64 bg-white border-r'>
			<Link
				href='/dashboard'
				className='grid place-items-center py-4 border-b'
			>
				<Logo width={96} />
			</Link>

			<nav className='flex-1 overflow-y-auto'>
				<ul className='p-4 space-y-2'>
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
