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
	const cart = useCart()
	const hasItems = cart.items.length > 0
	const pathname = usePathname()

	useEffect(() => cart.setIsOpen(false), [pathname])

	return (
		<Sheet
			open={cart.isOpen}
			onOpenChange={cart.setIsOpen}
		>
			<SheetTrigger
				aria-label='Cart'
				className='relative'
			>
				<ShoppingCartIcon className='size-6' />
				{hasItems && (
					<div className='absolute right-0 top-0 -mr-2 -mt-2 size-4 rounded bg-red-600 text-xs font-medium text-white'>
						{cart.items.length > 9 ? '9+' : cart.items.length}
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
						<CartItemList items={cart.items} />
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
