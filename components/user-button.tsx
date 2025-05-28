import { auth, signIn, signOut } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import Link from 'next/link'
import SubmitButton from './submit-button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu'
import Avatar from './utils/avatar'

export default async function UserButton({ ...props }) {
	const session = await auth()

	if (!session || !session.user) {
		return (
			<form
				action={async () => {
					'use server'
					await signIn('google')
				}}
				{...props}
			>
				<SubmitButton>Sign In</SubmitButton>
			</form>
		)
	}

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
				{['admin', 'moderator'].includes(currentUser.role) && (
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
