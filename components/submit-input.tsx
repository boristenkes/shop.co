'use client'

import { useFormStatus } from 'react-dom'
import { Input } from './ui/input'

export default function SubmitInput({
	...props
}: React.ComponentProps<'input'>) {
	const { pending } = useFormStatus()

	return (
		<Input
			disabled={pending || props.disabled}
			{...props}
		/>
	)
}
