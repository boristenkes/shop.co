'use client'

import Cookies from 'js-cookie'
import { createContext, useCallback, useContext, useState } from 'react'

export type CookieContextValue = {
	value: string | undefined
	set: (value: string, options: Cookies.CookieAttributes) => void
	remove: () => void
}

const CookieContext = createContext<CookieContextValue | null>(null)

export function CookieProvider({
	children,
	cookieKey
}: {
	children: React.ReactNode
	cookieKey: string
}) {
	const [cookie, setCookie] = useState<CookieContextValue['value']>(
		Cookies.get(cookieKey)
	)

	const set = useCallback(
		(value: string, options: Cookies.CookieAttributes) => {
			setCookie(value)
			Cookies.set(cookieKey, value, options)
		},
		[cookieKey]
	)

	const remove = useCallback(() => {
		Cookies.remove(cookieKey)
		setCookie(undefined)
	}, [cookieKey])

	return (
		<CookieContext.Provider value={{ value: cookie, set, remove }}>
			{children}
		</CookieContext.Provider>
	)
}

export function useCookie() {
	const context = useContext(CookieContext)
	if (!context) throw new Error('useCookie must be used within CookieProvider')
	return context
}
