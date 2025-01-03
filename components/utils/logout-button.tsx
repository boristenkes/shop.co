import { signOut } from '@/lib/auth'
import { ComponentProps } from 'react'

export type LogoutButtonProps = ComponentProps<'form'> & {
	redirectTo?: string
}

export default function LogoutButton({
	redirectTo,
	...props
}: LogoutButtonProps) {
	return (
		<form
			action={async () => {
				'use server'
				await signOut({ redirectTo })
			}}
			{...props}
		/>
	)
}
