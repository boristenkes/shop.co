'use client'

import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './ui/button'

export default function SubmitButton({ children, ...props }: ButtonProps) {
	const { pending } = useFormStatus()

	return (
		<Button
			disabled={pending || props.disabled}
			type='submit'
			{...props}
		>
			{pending ? <Loader2Icon className='size-4 animate-spin' /> : children}
		</Button>
	)
}
