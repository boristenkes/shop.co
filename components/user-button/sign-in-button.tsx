'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInButton() {
	const [pending, setPending] = useState(false)

	if (pending)
		return (
			<Button disabled>
				<Loader2Icon className='size-4 animate-spin' />
			</Button>
		)

	return (
		<div className='flex'>
			<Button
				className='rounded-e-none border-r'
				onClick={async () => {
					setPending(true)
					await signIn('google')
				}}
			>
				Sign In
			</Button>

			<Select
				onValueChange={async (role: 'admin:demo' | 'customer:demo') => {
					setPending(true)
					await signIn('credentials', { role })
				}}
			>
				<SelectTrigger
					className={cn(
						buttonVariants({ size: 'icon' }),
						'rounded-s-none border-none'
					)}
					hideArrow
				>
					<ChevronDownIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Sign in as:</SelectLabel>
						<SelectItem value='admin:demo'>Demo Admin</SelectItem>
						<SelectItem value='customer:demo'>Demo Customer</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
