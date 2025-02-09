'use client'

import CartItemList from '@/components/cart/item-list'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { CartSyncAlert, useCart } from '@/context/cart'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function CartButton() {
	const { sessionCartItems, cartOpen, setCartOpen } = useCart()
	const hasItems = sessionCartItems.length > 0
	const pathname = usePathname()

	useEffect(() => setCartOpen(false), [pathname])

	return (
		<Sheet
			open={cartOpen}
			onOpenChange={setCartOpen}
		>
			<SheetTrigger
				aria-label='Cart'
				className='relative'
			>
				<ShoppingCartIcon className='size-6' />
				{hasItems && (
					<div className='absolute right-0 top-0 -mr-2 -mt-2 size-4 rounded bg-red-600 text-xs font-medium text-white'>
						{sessionCartItems.length > 9 ? '9+' : sessionCartItems.length}
					</div>
				)}
			</SheetTrigger>
			<SheetContent className='flex flex-col'>
				<SheetHeader>
					<SheetTitle>Cart</SheetTitle>
					<SheetDescription>
						This is where you will find your cart items.
					</SheetDescription>
				</SheetHeader>

				<CartSyncAlert />

				{hasItems ? (
					<div className='flex flex-col flex-grow justify-between overflow-hidden gap-4'>
						<CartItemList items={sessionCartItems} />
						<Button asChild>
							<Link href='/cart'>Go to cart page</Link>
						</Button>
					</div>
				) : (
					<div className='mx-auto py-8 w-fit'>
						<ShoppingCartIcon className='size-32' />
						<p className='mx-auto mt-4 text-center font-medium text-lg'>
							Your cart is empty
						</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}

/*

Using Next.js, Drizzle ORM with Neon PostgreSQL. Build a fully functional ecommerce store cart.
- If user is signed out, store items in session storage
- If user is signed in, store items in database
There is `carts` table and `cart_items` table. Below are defined schemas:
```
import { relations } from 'drizzle-orm'
import {
	integer,
	pgTable,
	serial,
	smallint,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { colors } from './colors'
import { sizeEnum } from './enums'
import { products } from './products'
import { users } from './users'

export const carts = pgTable('carts', {
	id: serial().primaryKey(),

	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
})

export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(users, {
		fields: [carts.userId],
		references: [users.id]
	}),
	cartItems: many(cartItems)
}))

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export const cartItems = pgTable(
	'cart_items',
	{
		id: serial().primaryKey(),
		quantity: smallint().notNull(),
		size: sizeEnum().notNull(),

		productId: integer()
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		cartId: integer()
			.notNull()
			.references(() => carts.id, { onDelete: 'cascade' }),
		colorId: integer()
			.notNull()
			.references(() => colors.id, { onDelete: 'cascade' }),

		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	t => [
		uniqueIndex('cart_item_unique').on(t.cartId, t.productId, t.size, t.colorId)
	]
)

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id]
	}),
	color: one(colors, {
		fields: [cartItems.colorId],
		references: [colors.id]
	})
}))

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert
```
Create cart context which will be used to access cart from anywhere in the app. Here's what I got so far:
```
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
```
You edit it as you wish, make sure to add loading states while items are being fetched from database if user is signed in. I am using Auth.js, you can get user session using `useSession` hook.
If you can, implement optimistic updates as well. When user adds item to cart, changes should be displayed immediately when rolled back if request fails. Use `useOptimistic` hook or react-query. Here is form on product details page which adds items to the cart:
```
'use client'

import ErrorMessage from '@/components/error-message'
import NumberInput from '@/components/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SessionCartProduct, useCart } from '@/context/cart'
import { Color } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { NewItemData, saveToCart } from '@/features/cart/actions'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ProductPageFormProps = {
	colors: Color[]
	sizes: TSize[]
	stock: number
	currentUserId: number | undefined
	product: SessionCartProduct
}

export default function ProductPageForm({
	colors,
	sizes,
	stock,
	currentUserId,
	product
}: ProductPageFormProps) {
	const params = useSearchParams()
	const { sessionCartItems, addToCart } = useCart()
	const [color, setColor] = useState<Color | null>(
		colors.find(c => c.slug === params.get('color')) ?? null
	)
	const [size, setSize] = useState<TSize | null>(
		sizes.includes(params.get('size') as TSize)
			? (params.get('size') as TSize)
			: null
	)
	const [quantity, setQuantity] = useState(1)
	const mutation = useMutation({
		mutationKey: ['cart:create'],
		mutationFn: async (data: NewItemData) => saveToCart(data),
		onSettled(data) {
			if (data?.success) {
				toast.success('Added to cart')
			}
		}
	})

	useEffect(() => {
		// Persist color and size in URL search params
		const searchParams = new URLSearchParams(params)

		if (color)
			searchParams.set(
				'color',
				colors.find(c => c.id === color.id)?.slug as string
			)
		else searchParams.delete('color')

		if (size) searchParams.set('size', size)
		else searchParams.delete('size')

		history.replaceState(null, '', `?${searchParams.toString()}`)
	}, [color, size, colors, params])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!color || !size) return

		try {
			if (currentUserId) {
				mutation.mutate({
					size,
					quantity,
					colorId: color.id,
					productId: product.id
				})
			} else {
				const isAlreadyInCart = sessionCartItems.some(
					item =>
						item.product.id === product.id &&
						item.color.id === color.id &&
						item.size === size
				)

				if (isAlreadyInCart)
					throw new Error(
						'This product with same color and size is already in the cart.'
					)

				addToCart({ product, color, quantity, size }) // Use local cart context
				toast.success('Product added to the cart')
			}
		} catch (error: any) {
			toast.error(error.message)
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<div className='flex gap-10 items-start pb-6 border-b'>
				<div className='space-y-4'>
					<Label className='text-base font-normal text-stone-700'>
						Choose color
					</Label>
					<RadioGroup
						className='flex items-center gap-2 flex-wrap'
						onValueChange={value =>
							setColor(colors.find(c => c.id === Number(value)) as Color)
						}
						defaultValue={color?.id.toString()}
					>
						{colors.map(color => (
							<RadioGroupItem
								key={color.slug}
								value={color.id.toString()}
								className='size-8'
								style={{ backgroundColor: color.hexCode }}
								disabled={mutation.isPending}
							/>
						))}
					</RadioGroup>
				</div>

				<div className='space-y-4'>
					<Label className='text-base font-normal text-stone-700'>
						Choose Size
					</Label>
					<div className='flex flex-wrap gap-2'>
						{sizes.map(s => (
							<Button
								key={s}
								type='button'
								variant={size === s ? 'default' : 'outline'}
								onClick={() => setSize(s)}
								disabled={mutation.isPending}
							>
								{s}
							</Button>
						))}
					</div>
				</div>
			</div>

			{mutation.data && !mutation.data.success && (
				<ErrorMessage message={mutation.data.message} />
			)}

			<div className='flex items-center gap-5 mt-6 flex-wrap'>
				<Label className='sr-only'>Quantity (max {Math.min(stock, 20)})</Label>
				<NumberInput
					value={quantity}
					onChange={setQuantity}
					min={1}
					max={Math.min(stock, 20)}
					step={1}
					disabled={mutation.isPending}
				/>

				<Button
					size='lg'
					className='grow'
					disabled={mutation.isPending || !color || !size}
				>
					{mutation.isPending ? (
						<Loader2Icon className='animate-spin' />
					) : (
						<ShoppingCartIcon />
					)}
					{mutation.isPending ? 'Adding to cart' : 'Add to cart'}
				</Button>
			</div>
		</form>
	)
}
```
And here is cart button, which opens sidebar to display cart items. This is where loading state would be displayed while items are being fetched from database:
```
'use client'

import CartItemList from '@/components/cart/item-list'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { CartSyncAlert, useCart } from '@/context/cart'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function CartButton() {
	const { sessionCartItems, cartOpen, setCartOpen } = useCart()
	const hasItems = sessionCartItems.length > 0
	const pathname = usePathname()

	useEffect(() => setCartOpen(false), [pathname])

	return (
		<Sheet
			open={cartOpen}
			onOpenChange={setCartOpen}
		>
			<SheetTrigger
				aria-label='Cart'
				className='relative'
			>
				<ShoppingCartIcon className='size-6' />
				{hasItems && (
					<div className='absolute right-0 top-0 -mr-2 -mt-2 size-4 rounded bg-red-600 text-xs font-medium text-white'>
						{sessionCartItems.length > 9 ? '9+' : sessionCartItems.length}
					</div>
				)}
			</SheetTrigger>
			<SheetContent className='flex flex-col'>
				<SheetHeader>
					<SheetTitle>Cart</SheetTitle>
					<SheetDescription>
						This is where you will find your cart items.
					</SheetDescription>
				</SheetHeader>

				<CartSyncAlert />

				{hasItems ? (
					<div className='flex flex-col flex-grow justify-between overflow-hidden gap-4'>
						<CartItemList items={sessionCartItems} />
						<Button asChild>
							<Link href='/cart'>Go to cart page</Link>
						</Button>
					</div>
				) : (
					<div className='mx-auto py-8 w-fit'>
						<ShoppingCartIcon className='size-32' />
						<p className='mx-auto mt-4 text-center font-medium text-lg'>
							Your cart is empty
						</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}
```

*/
