import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { auth, signIn, signOut } from '@/lib/auth'
import { getInitials } from '@/lib/utils'
import SubmitButton from './submit-button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

export default async function UserButton() {
	const session = await auth()

	if (!session)
		return (
			<form
				action={async () => {
					'use server'
					await signIn('google')
				}}
			>
				<SubmitButton variant='secondary'>Sign In</SubmitButton>
			</form>
		)

	const user = session.user

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='overflow-hidden rounded-full text-neutral-900'
				>
					<Avatar className='overflow-hidden rounded-full'>
						<AvatarImage
							src={user.image ?? '/default.jpg'}
							alt={user.name!}
						/>
						<AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuItem>Support</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<form
						action={async () => {
							'use server'
							await signOut()
						}}
					>
						<button>Logout</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
