import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import CouponDiscount from '@/features/coupon/components/coupon-discount'
import { GetOwnOrdersOrder } from '@/features/orders/actions/read'
import { formatDate, formatPrice } from '@/utils/format'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderTable({ order }: { order: GetOwnOrdersOrder }) {
	const totalWithoutCoupon = order.orderItems.reduce(
		(acc, curr) => acc + curr.productPriceInCents * curr.quantity,
		0
	)

	return (
		<Table>
			<TableCaption>
				Order date:{' '}
				<time
					dateTime={order.createdAt.toISOString()}
					className='font-medium'
				>
					{formatDate(order.createdAt!)}
				</time>
			</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>Product</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead>Color</TableHead>
					<TableHead>Size</TableHead>
					<TableHead className='text-right'>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{order.orderItems.map(item => (
					<TableRow key={item.id}>
						<TableCell className='font-medium'>
							<Link
								href={`/products/${item.product.slug}/${item.product.id}`}
								className='hover:underline underline-offset-4'
							>
								<Image
									src={item.product.images[0].url}
									alt={item.product.name}
									width={64}
									height={64}
									className='size-16 rounded-lg object-contain bg-stone-100 p-px'
								/>
							</Link>
						</TableCell>
						<TableCell>{formatPrice(item.productPriceInCents)}</TableCell>
						<TableCell>{item.quantity}</TableCell>
						<TableCell>
							<Badge
								variant='outline'
								className='border'
								style={{
									backgroundColor: item.color.hexCode + '33' // '33' = 20% opacity
								}}
							>
								<div
									className='size-3 rounded-sm mr-1'
									style={{ backgroundColor: item.color.hexCode }}
								/>{' '}
								{item.color.name}
							</Badge>
						</TableCell>
						<TableCell>{item.size}</TableCell>
						<TableCell className='text-right'>
							{formatPrice(item.productPriceInCents * item.quantity)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell
						className='ml-auto'
						colSpan={5}
					>
						Total
					</TableCell>
					<TableCell className='flex items-center gap-2 justify-end'>
						{order.coupon && (
							<div className='flex items-center gap-2'>
								{formatPrice(totalWithoutCoupon)}
								<span>-</span>
								<Badge variant='outline'>
									{order.coupon.code}
									<CouponDiscount
										type={order.coupon.type}
										value={order.coupon.value}
										className='text-red-500 font-semibold ml-2'
									/>
								</Badge>
								<span>=</span>
							</div>
						)}

						{formatPrice(order.totalPriceInCents)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}

export function OrderTableSkeleton({ itemCount }: { itemCount: number }) {
	return (
		<Table>
			<TableCaption>
				<Skeleton className='w-60 h-5 rounded-lg' />
			</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
					<TableHead>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
					<TableHead>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
					<TableHead>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
					<TableHead>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
					<TableHead className='text-right'>
						<Skeleton className='w-12 h-5 rounded-sm' />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: itemCount }).map((_, idx) => (
					<TableRow key={idx}>
						<TableCell className='font-medium'>
							<Skeleton className='size-16 rounded-lg' />
						</TableCell>
						<TableCell>
							<Skeleton className='w-16 h-5 rounded-sm' />
						</TableCell>
						<TableCell>
							<Skeleton className='w-4 h-5 rounded-sm' />
						</TableCell>
						<TableCell>
							<Skeleton className='w-16 h-5 rounded-full' />
						</TableCell>
						<TableCell>
							<Skeleton className='w-12 h-5 rounded-sm' />
						</TableCell>
						<TableCell className='text-right'>
							<Skeleton className='w-12 h-5 rounded-sm' />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell
						className='ml-auto'
						colSpan={5}
					>
						<Skeleton className='size-full rounded-lg' />
					</TableCell>
					<TableCell className='text-right'>
						<Skeleton className='size-full rounded-lg' />
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
