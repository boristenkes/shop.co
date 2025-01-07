'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { TSize } from '@/db/schema/enums'
import { saveItemsToCart } from '@/features/cart/actions'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

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
		setLocalCartItems([])
		localStorage.removeItem(LOCAL_STORAGE_CART_KEY)
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

			<CartSyncAlert />
		</CartContext.Provider>
	)
}

function CartSyncAlert() {
	const session = useSession()
	const [showDialog, setShowDialog] = useState(false)

	const { localCartItems, clearCart } = useCart()
	const mutation = useMutation({
		mutationKey: ['cart:sync'],
		mutationFn: () => saveItemsToCart(localCartItems),
		onSettled(data) {
			if (data?.success) {
				toast.success('Cart synced successfully')
				setShowDialog(false)
				clearCart()
			}
		}
	})

	useEffect(() => {
		if (session.status === 'authenticated' && localCartItems.length)
			setShowDialog(true)
	}, [session, localCartItems])

	if (!showDialog) return null

	return (
		<Dialog
			open={showDialog}
			onOpenChange={setShowDialog}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sync Your Cart</DialogTitle>
					<DialogDescription>
						We noticed you have stored items in your cart. Would you like to
						store them in your account?
					</DialogDescription>
				</DialogHeader>

				<div className='flex items-center space-x-2'>
					<Checkbox id='dont-disturb' />
					<label
						htmlFor='dont-disturb'
						className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						Don't ask again
					</label>
				</div>

				{mutation.data && !mutation.data.success && (
					<ErrorMessage message={mutation.data.message} />
				)}

				<DialogFooter className='space-x-2'>
					<Button
						variant='secondary'
						onClick={() => setShowDialog(false)}
						disabled={mutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
					>
						{mutation.isPending && <Loader2Icon className='animate-spin' />}
						{mutation.isPending ? 'Storing' : 'Yes, store in database'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
