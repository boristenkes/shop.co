'use client'

import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'

export type CopyButtonProps = React.ComponentProps<'button'> & {
	text: string
	iconClassName?: string
}

export default function CopyButton({
	text,
	iconClassName = '',
	className,
	...props
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		await navigator.clipboard.writeText(text)
		setCopied(true)

		setTimeout(() => setCopied(false), 3000)
	}

	return (
		<button
			onClick={copy}
			type='button'
			className={cn(!copied && 'hover:opacity-70', className)}
			disabled={copied || props.disabled}
			{...props}
		>
			{copied ? (
				<CheckIcon className={cn('size-4', iconClassName)} />
			) : (
				<CopyIcon className={cn('size-4', iconClassName)} />
			)}
		</button>
	)
}
