'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, XIcon } from 'lucide-react'

type Props = {
	message: string
}

export default function ErrorMessage({ message }: Props) {
	return (
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
				onClick={e => e.currentTarget.parentElement?.remove()}
			>
				<XIcon className='size-4' />
			</button>
		</Alert>
	)
}
