import { User } from '@/db/schema/users'
import { auth, signIn, signOut } from '@/lib/auth'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import SubmitButton from './submit-button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu'

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

	const currentUser = session.user as User

	return (
		<DropdownMenu>
			<DropdownMenuTrigger {...props}>
				<Avatar>
					<AvatarImage
						src={currentUser.image!}
						alt={currentUser.name!}
					/>
					<AvatarFallback>{getInitials(currentUser.name!)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				{['admin', 'moderator'].includes(currentUser.role) && (
					<DropdownMenuItem>
						<Link href='/dashboard'>Dashboard</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
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
