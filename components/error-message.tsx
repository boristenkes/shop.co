'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type Props = {
	message: string
	onClose?: () => void
}

export default function ErrorMessage({ message, onClose }: Props) {
	const [isVisible, setIsVisible] = useState(true)

	const handleClose = () => {
		setIsVisible(false)
		onClose?.()
	}

	return (
		isVisible && (
			<Alert
				variant='destructive'
				className='relative'
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
	)
}
