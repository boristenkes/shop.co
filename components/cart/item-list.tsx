import { SessionCartItem } from '@/context/cart'
import { cn } from '@/lib/utils'
import CartItem from './item'

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
