'use client'

import { Button } from '@/components/ui/button'
import { FrownIcon } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => console.error(error), [error])

	return (
		<main className='flex min-h-screen h-full flex-col items-center justify-center space-y-4 text-center'>
			<FrownIcon size={48} />
			<div>
				<h1 className='text-center text-2xl'>Something went wrong</h1>
				<p>500 Internal Server Error</p>
			</div>
			<Button onClick={reset}>Try again</Button>
		</main>
	)
}
