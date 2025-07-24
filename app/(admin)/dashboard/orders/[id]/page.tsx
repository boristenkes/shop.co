import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
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
import Avatar from '@/components/utils/avatar'
import { BackButton } from '@/components/utils/back-button'
import CouponDiscount from '@/features/coupon/components/coupon-discount'
import { getOrder } from '@/features/orders/actions/read'
import OrderStatusBadge from '@/features/orders/components/status-badge'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatId, formatPrice, timeFormatter } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderStatusButton from './_components/status-button'

export default async function OrderDetailsPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'orders', ['read']))
		notFound()

	const orderId = (await props.params).id
	const response = await getOrder(Number(orderId))
	const totalWithoutCoupon = response.success
		? response.order.orderItems.reduce(
				(acc, curr) => acc + curr.productPriceInCents * curr.quantity,
				0
		  )
		: 0

	return (
		<main className='container py-16'>
			<div className='flex items-center gap-4 mb-8'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>
				<h1 className='text-4xl font-bold'>Order Details</h1>
			</div>

			{response.success ? (
				<Card>
					<CardHeader className='flex justify-between flex-row items-start'>
						<div>
							<CardTitle className='flex items-center gap-4'>
								Order ID: {formatId(response.order.id)}{' '}
								<OrderStatusBadge status={response.order.status} />
							</CardTitle>
							<CardDescription className='mt-2'>
								{response.order.shippingAddress ?? 'No address'}
							</CardDescription>
						</div>

						<div className='flex items-center gap-4'>
							{response.order.receiptUrl && (
								<a
									href={response.order.receiptUrl}
									className='font-semibold text-slate-700 hover:text-slate-500 flex items-center gap-2'
									target='_blank'
								>
									View Receipt
								</a>
							)}

							<OrderStatusButton
								status={response.order.status}
								orderId={response.order.id}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<Link
							href={`/dashboard/users/${response.order.user.id}`}
							className='flex items-center gap-2 mb-4'
						>
							<Avatar
								src={response.order.user.image!}
								alt={response.order.user.name}
								width={32}
								height={32}
							/>
							<p className='font-medium'>{response.order.user.name}</p>
						</Link>

						<Table>
							<TableCaption>
								Order date:{' '}
								<time
									dateTime={response.order.createdAt.toISOString()}
									className='font-medium'
								>
									{timeFormatter.format(response.order.createdAt)}
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
								{response.order.orderItems.map(item => (
									<TableRow key={item.id}>
										<TableCell className='font-medium'>
											<Link
												href={`/dashboard/products/${item.product.id}`}
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
										<TableCell>
											{formatPrice(item.productPriceInCents)}
										</TableCell>
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
										{response.order.coupon && (
											<div className='flex items-center gap-2'>
												{formatPrice(totalWithoutCoupon)}
												<span>-</span>
												<Badge variant='outline'>
													{response.order.coupon.code}
													<CouponDiscount
														type={response.order.coupon.type}
														value={response.order.coupon.value}
														className='text-red-500 font-semibold ml-2'
													/>
												</Badge>
												<span>=</span>
											</div>
										)}

										{formatPrice(response.order.totalPriceInCents)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</CardContent>
				</Card>
			) : (
				<ErrorMessage message={response.message ?? 'Something went wrong'} />
			)}
		</main>
	)
}
