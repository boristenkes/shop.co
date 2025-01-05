'use client'

import { useEffect } from 'react'

export default function ProductPage() {
	useEffect(() => window.scrollTo({ top: 0 }), [])

	return <div>ProductPage</div>
}
