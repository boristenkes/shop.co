import { BackButton } from '@/components/utils/back-button'
import { ArrowLeftIcon } from 'lucide-react'

export default function NotFoundPage() {
	return (
		<main className='container grid place-content-center min-h-screen text-center gap-8'>
			<div>
				<h1 className='text-5xl font-semibold mb-2'>404 | Page not found</h1>
				<p>Page you tried to access does not exist.</p>
			</div>
			<BackButton
				variant='outline'
				className='rounded-lg'
			>
				<ArrowLeftIcon />
				Go back
			</BackButton>
		</main>
	)
}
