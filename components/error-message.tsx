'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { AlertCircleIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type Props = React.ComponentProps<'div'> & {
	message: string
	onClose?: () => void
}

export default function ErrorMessage({
	message,
	onClose,
	className,
	...props
}: Props) {
	const [isVisible, setIsVisible] = useState(true)

	const handleClose = () => {
		setIsVisible(false)
		onClose?.()
	}

	if (!isVisible) return null

	return (
		<Alert
			variant='destructive'
			className={cn('relative', className)}
			{...props}
		>
			<AlertCircleIcon className='size-4' />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
			<button
				className='absolute top-4 right-4'
				type='button'
				onClick={handleClose}
			>
				<XIcon className='size-4' />
			</button>
		</Alert>
	)
}
