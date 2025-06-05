import SubmitButton from '@/components/submit-button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Avatar from '@/components/utils/avatar'
import { auth, signOut } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import Link from 'next/link'
import SignInButton from './sign-in-button'

export default async function UserButton({ ...props }) {
	const session = await auth()

	if (!session || !session.user) return <SignInButton />

	const currentUser = session.user

	return (
		<DropdownMenu>
			<DropdownMenuTrigger {...props}>
				<Avatar
					src={currentUser.image!}
					alt={currentUser.name}
					width={40}
					height={40}
					className='size-10'
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Link href='/profile'>Profile</Link>
				</DropdownMenuItem>
				{hasPermission(currentUser.role, 'orders', ['read:own']) && (
					<DropdownMenuItem>
						<Link href='/orders'>My Orders</Link>
					</DropdownMenuItem>
				)}
				{hasPermission(currentUser.role, 'reviews', ['read:own']) && (
					<DropdownMenuItem>
						<Link href='/reviews'>My Reviews</Link>
					</DropdownMenuItem>
				)}
				{['admin', 'moderator', 'admin:demo'].includes(currentUser.role) && (
					<DropdownMenuItem>
						<Link href='/dashboard'>Dashboard</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<form
						action={async () => {
							'use server'
							await signOut()
						}}
					>
						<SubmitButton
							variant='ghost'
							className='p-0 h-auto text-sm font-normal'
						>
							Sign Out
						</SubmitButton>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
