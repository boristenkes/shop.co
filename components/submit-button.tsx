'use client'

import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './ui/button'

type SubmitButtonProps = ButtonProps & {
	pendingText?: string
}

export default function SubmitButton({
	children,
	pendingText,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus()

	return (
		<Button
			disabled={pending || props.disabled}
			type='submit'
			{...props}
		>
			{pending && pendingText}
			{pending ? <Loader2Icon className='size-4 animate-spin' /> : children}
		</Button>
	)
}
