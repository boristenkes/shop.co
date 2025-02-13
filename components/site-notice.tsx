'use client'

import { AlertCircleIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SiteNotice() {
	const [isNoticed, setIsNoticed] = useState(true)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsNoticed(!!sessionStorage.getItem('noticed'))
		}
	}, [])

	const notice = () => {
		sessionStorage.setItem('noticed', 'true')
		setIsNoticed(true)
	}

	if (isNoticed) return null

	return (
		<div
			role='alert'
			className='fixed inset-x-0 top-0 mt-20 z-10 flex items-center justify-center gap-2 flex-wrap py-2 px-2 text-neutral-100 bg-red-500'
		>
			<AlertCircleIcon />
			<p className='text-center'>
				This website is a practice project created to showcase web development
				skills. It is not an actual store, and no purchases can be made.
			</p>
			<AlertCircleIcon />

			<button
				onClick={notice}
				className='absolute right-2 top-1/2 -translate-y-1/2'
				aria-label='Close notice'
			>
				<XIcon />
			</button>
		</div>
	)
}
