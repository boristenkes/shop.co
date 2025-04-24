'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Color } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { Product } from '@/db/schema/products'
import { getUserCartItems } from '@/features/cart/actions/read'
import { syncUserCart } from '@/features/cart/actions/update'
import { SetState } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'

export type SessionCartProduct = Pick<
	Product,
	'id' | 'name' | 'slug' | 'priceInCents' | 'discount' | 'stock'
> & { image: string }

export type SessionCartItem = {
	id: string | number
	color: Color
	size: TSize
	quantity: number
	product: SessionCartProduct
}

type CartContextValue = {
	items: SessionCartItem[]
	add: (item: Omit<SessionCartItem, 'id'>) => void
	edit: (
		itemId: SessionCartItem['id'],
		newData: Partial<SessionCartItem>
	) => void
	remove: (itemId: SessionCartItem['id']) => void
	get: (itemId: SessionCartItem['id']) => SessionCartItem | undefined
	clear: () => void
	isOpen: boolean
	setIsOpen: SetState<boolean>
	isLoading: boolean
	isError: boolean
	error: Error | null
}

const CartContext = createContext<CartContextValue | null>(null)

export const SESSION_STORAGE_CART_KEY = 'cart'

export const useCart = () => {
	const context = useContext(CartContext)

	if (!context) throw new Error('useCart must be used within CartProvider')

	return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<SessionCartItem[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const session = useSession()
	const isAuthenticated = session.status === 'authenticated'
	const cartQuery = useQuery({
		queryKey: ['cart:get:own'],
		queryFn: () => getUserCartItems(session.data?.user.id!),
		enabled: isAuthenticated
	})

	useEffect(() => {
		if (cartQuery.data?.success) {
			setItems(cartQuery.data.items)
		}
	}, [cartQuery.data])

	useEffect(() => {
		const asyncFn = async () => {
			if (typeof window === 'undefined') return

			try {
				const stored = sessionStorage.getItem(SESSION_STORAGE_CART_KEY)

				const parsed = JSON.parse(stored ?? '[]') as SessionCartItem[]

				if (!isAuthenticated) {
					setItems(parsed)
					return
				}

				if (!parsed.length) return

				const response = await syncUserCart(parsed)

				if (!response.success)
					throw new Error('Failed to save browser cart in database')
				sessionStorage.removeItem(SESSION_STORAGE_CART_KEY)
				cartQuery.refetch()
			} catch (error) {
				console.error('Failed to parse cart items from sessionStorage')
				sessionStorage.removeItem(SESSION_STORAGE_CART_KEY)
			}
		}

		asyncFn()
	}, [session])

	const syncSessionStorage = (newItems: SessionCartItem[]) => {
		setItems(newItems)

		if (!isAuthenticated) {
			sessionStorage.setItem(SESSION_STORAGE_CART_KEY, JSON.stringify(newItems))
		}
	}

	const add = (newItem: Omit<SessionCartItem, 'id'>) => {
		const isAlreadyInCart = items.some(
			item =>
				item.product.id === newItem.product.id &&
				item.color.id === newItem.color.id &&
				item.size === newItem.size
		)

		if (isAlreadyInCart)
			throw new Error(
				'This product with same color and size is already in the cart.'
			)

		syncSessionStorage([...items, { id: crypto.randomUUID(), ...newItem }])
	}

	const edit = (
		itemId: SessionCartItem['id'],
		newData: Partial<SessionCartItem>
	) => {
		const updatedItems = items.map(item =>
			item.id === itemId ? { ...item, ...newData } : item
		)

		syncSessionStorage(updatedItems)
	}

	const remove = (itemId: SessionCartItem['id']) => {
		const filteredItems = items.filter(item => item.id !== itemId)

		syncSessionStorage(filteredItems)
	}

	const clear = () => {
		setItems([])
		sessionStorage.removeItem(SESSION_STORAGE_CART_KEY)
	}

	const get = (itemId: SessionCartItem['id']) => {
		return items.find(item => item.id === itemId)
	}

	return (
		<CartContext.Provider
			value={{
				items,
				add,
				edit,
				remove,
				clear,
				get,
				isOpen,
				setIsOpen,
				isLoading: cartQuery.isLoading || session.status === 'loading',
				isError: cartQuery.isError,
				error: cartQuery.error
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export function CartSyncAlert(props: React.ComponentProps<'div'>) {
	const session = useSession()
	const { items: sessionCartItems } = useCart()

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
