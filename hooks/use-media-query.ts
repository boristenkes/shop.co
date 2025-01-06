'use client'

import { useCallback, useEffect, useState } from 'react'

export default function useMediaQuery(query: string): boolean {
	const [targetReached, setTargetReached] = useState<boolean>(false)

	const updateTarget = useCallback(
		(e: MediaQueryListEvent) => {
			setTargetReached(e.matches)
		},
		[setTargetReached]
	)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const media = window.matchMedia(query)
		media.addEventListener('change', updateTarget)

		if (media.matches) {
			setTargetReached(true)
		}

		return () => media.removeEventListener('change', updateTarget)
	}, [query, updateTarget])

	return targetReached
}
