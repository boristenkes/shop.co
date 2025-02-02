'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Color } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { Product } from '@/db/schema/products'
import { AlertCircleIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type SessionCartProduct = Pick<
	Product,
	'id' | 'name' | 'slug' | 'priceInCents' | 'discount' | 'stock'
> & { image: string }

export type SessionCartItem = {
	id: string
	color: Color
	size: TSize
	quantity: number
	product: SessionCartProduct
}

type CartContextValue = {
	sessionCartItems: SessionCartItem[]
	addToCart: (item: Omit<SessionCartItem, 'id'>) => void
	editCartItem: (
		itemId: SessionCartItem['id'],
		newData: Partial<SessionCartItem>
	) => void
	removeFromCart: (itemId: SessionCartItem['id']) => void
	clearCart: () => void
	cartOpen: boolean
	setCartOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CartContext = createContext<CartContextValue | null>(null)

export const SESSION_STORAGE_CART_KEY = 'cart'

export const useCart = () => {
	const context = useContext(CartContext)

	if (!context) throw new Error('useCart must be used within CartProvider')

	return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [sessionCartItems, setSessionCartItems] = useState<SessionCartItem[]>(
		[]
	)
	const [cartOpen, setCartOpen] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return

		try {
			const stored = sessionStorage.getItem(SESSION_STORAGE_CART_KEY)

			setSessionCartItems(JSON.parse(stored ?? '[]'))
		} catch (error) {
			console.error('Failed to parse cart items from sessionStorage')
			sessionStorage.removeItem(SESSION_STORAGE_CART_KEY)
		}
	}, [])

	const syncSessionStorage = (items: SessionCartItem[]) => {
		setSessionCartItems(items)

		sessionStorage.setItem(SESSION_STORAGE_CART_KEY, JSON.stringify(items))
	}

	const addToCart = (item: Omit<SessionCartItem, 'id'>) => {
		syncSessionStorage([
			...sessionCartItems,
			{ id: crypto.randomUUID(), ...item }
		])
	}

	const editCartItem = (
		itemId: SessionCartItem['id'],
		newData: Partial<SessionCartItem>
	) => {
		const updatedItems = sessionCartItems.map(item =>
			item.id === itemId ? { ...item, ...newData } : item
		)

		syncSessionStorage(updatedItems)
	}

	const removeFromCart = (itemId: SessionCartItem['id']) => {
		const filteredItems = sessionCartItems.filter(item => item.id !== itemId)

		syncSessionStorage(filteredItems)
	}

	const clearCart = () => {
		setSessionCartItems([])
		sessionStorage.removeItem(SESSION_STORAGE_CART_KEY)
	}

	return (
		<CartContext.Provider
			value={{
				sessionCartItems,
				addToCart,
				editCartItem,
				removeFromCart,
				clearCart,
				cartOpen,
				setCartOpen
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export function CartSyncAlert(props: React.ComponentProps<'div'>) {
	const session = useSession()
	const { sessionCartItems } = useCart()

	if (session.status !== 'unauthenticated' || sessionCartItems.length === 0)
		return null

	return (
		<Alert
			variant='warning'
			{...props}
		>
			<AlertCircleIcon className='size-4' />
			<AlertTitle>Warning - You are not signed in</AlertTitle>
			<AlertDescription>
				Cart items will disappear once you leave the browser unless you sign in.
			</AlertDescription>
		</Alert>
	)
}
