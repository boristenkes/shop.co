'use client'

import { useCart } from '@/context/cart'
import { ShoppingCartIcon } from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '../ui/sheet'

export default function CartButton() {
	const { localCartItems } = useCart()
	const hasItems = localCartItems.length > 0

	return (
		<Sheet>
			<SheetTrigger
				aria-label='Cart'
				className='relative'
			>
				<ShoppingCartIcon className='size-6' />
				{hasItems && (
					<div className='absolute right-0 top-0 -mr-2 -mt-2 size-4 rounded bg-red-600 text-xs font-medium text-white'>
						{localCartItems.length}
					</div>
				)}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Cart</SheetTitle>
					<SheetDescription>Here are your cart items</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
