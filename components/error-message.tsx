import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

type Props = {
	message: string
}

export default function ErrorMessage({ message }: Props) {
	return (
		<Alert variant='destructive'>
			<AlertCircleIcon className='size-4' />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
