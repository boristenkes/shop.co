'use client'

import useUpdateEffect from '@/hooks/use-update-effect'
import { usePathname } from 'next/navigation'

export default function ScrollToTop({
	children
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	useUpdateEffect(() => {
		if (typeof window === 'undefined') return

		window.scrollTo({ top: 0, behavior: 'instant' })
	}, [pathname])

	return children
}
