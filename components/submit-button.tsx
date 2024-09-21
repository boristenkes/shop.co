'use client'

import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'

export type SubmitButtonProps = ButtonProps & {
	pendingContent?: React.ReactNode
}

export default function SubmitButton({
	pendingContent = <Loader2Icon className='animate-spin size-4' />,
	children,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus()
	// const pending = true

	return (
		<Button
			type='submit'
			disabled={pending || props.disabled}
			size='sm'
			{...props}
		>
			{pending ? pendingContent : children}
		</Button>
	)
}
