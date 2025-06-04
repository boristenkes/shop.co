import Logo from '@/components/icons/logo'
import SubmitButton from '@/components/submit-button'
import LogoutButton from '@/components/utils/logout-button'
import { LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import NavbarLinks from './navbar-links'

export default function Navbar() {
	return (
		<header className='sticky top-0 w-full z-20 bg-white shadow-sm flex lg:hidden items-center justify-between gap-2 py-4 px-8'>
			<div className='flex items-center gap-4'>
				<LogoutButton redirectTo='/'>
					<SubmitButton
						variant='outline'
						className='size-10 rounded-sm'
					>
						<LogOutIcon className='size-4' />
					</SubmitButton>
				</LogoutButton>

				<Link href='/'>
					<Logo width={96} />
				</Link>
			</div>

			<div className='flex items-center gap-2'>
				<NavbarLinks />
			</div>
		</header>
	)
}
