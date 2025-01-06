'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrollToTop({
	children
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	useEffect(() => {
		if (typeof window === 'undefined') return

		window.scrollTo({ top: 0, behavior: 'instant' })
	}, [pathname])

	return children
}
