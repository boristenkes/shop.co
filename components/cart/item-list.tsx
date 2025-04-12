import { SessionCartItem } from '@/context/cart'
import { cn } from '@/lib/utils'
import CartItem, { CartItemSkeleton } from './item'

type CartItemListProps = React.ComponentProps<'ul'> & {
	items: SessionCartItem[]
}

export default function CartItemList({
	items,
	className,
	...props
}: CartItemListProps) {
	return (
		<ul
			className={cn(
				'p-3.5 rounded-3xl border-2 space-y-3.5 overflow-y-auto custom-scrollbar scroll-p-3.5',
				className
			)}
			{...props}
		>
			{items.map(item => (
				<CartItem
					key={item.id}
					item={item}
				/>
			))}
		</ul>
	)
}

export function CartItemListSkeleton({
	className,
	...props
}: Omit<CartItemListProps, 'items'>) {
	return (
		<ul
			className={cn(
				'p-3.5 rounded-3xl border-2 space-y-3.5 overflow-y-auto custom-scrollbar scroll-p-3.5',
				className
			)}
			{...props}
		>
			{Array.from({ length: 4 }).map((_, idx) => (
				<CartItemSkeleton key={idx} />
			))}
		</ul>
	)
}
