'use client'

import { TSize } from '@/db/schema/enums'
import { createContext, useContext, useEffect, useState } from 'react'

export type LocalCartItem = {
	colorId: number
	size: TSize
	quantity: number
	productId: number
}

type CartContextValue = {
	localCartItems: LocalCartItem[]
	addToCart: (item: LocalCartItem) => void
	removeFromCart: (productId: number, colorId: number, size: TSize) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const LOCAL_STORAGE_CART_KEY = 'shopco-cart'

export const useCart = () => {
	const context = useContext(CartContext)

	if (!context) throw new Error('useCart must be used within CartProvider')

	return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([])

	useEffect(() => {
		if (typeof window === 'undefined') return

		try {
			const stored = localStorage.getItem(LOCAL_STORAGE_CART_KEY)
			setLocalCartItems(JSON.parse(stored ?? '[]'))
		} catch (error) {
			console.error('Failed to parse cart items from localStorage')
			localStorage.removeItem(LOCAL_STORAGE_CART_KEY)
		}
	}, [])

	const syncLocalStorage = (items: LocalCartItem[]) => {
		setLocalCartItems(items)
		localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items))
	}

	const addToCart = (item: LocalCartItem) => {
		syncLocalStorage([...localCartItems, item])
	}

	const removeFromCart = (productId: number, colorId: number, size: TSize) => {
		syncLocalStorage(
			localCartItems.filter(
				cartItem =>
					!(
						cartItem.productId === productId &&
						cartItem.colorId === colorId &&
						cartItem.size === size
					)
			)
		)
	}

	const clearCart = () => {
		syncLocalStorage([])
	}

	return (
		<CartContext.Provider
			value={{
				localCartItems,
				addToCart,
				removeFromCart,
				clearCart
			}}
		>
			{children}
		</CartContext.Provider>
	)
}
