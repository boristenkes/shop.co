import { buttonVariants } from '@/components/ui/button'
import UserButton from '@/components/user-button'
import Link from 'next/link'

export default function Home() {
	return (
		<div className='min-h-screen grid place-content-center'>
			<UserButton />
			<Link
				className={buttonVariants({ variant: 'link', className: '!px-0' })}
				href='/dashboard'
			>
				Dashboard
			</Link>
		</div>
	)
}
