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
import { BackButton } from '@/components/utils/back-button'
import CouponDiscount from '@/features/coupon/components/coupon-discount'
import { getOrder } from '@/features/orders/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatDate, formatId, formatPrice } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderStatusSelect from './_components/status-select'

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
							<CardTitle>Order ID: {formatId(response.order.id)}</CardTitle>
							<CardDescription className='mt-2'>
								{response.order.shippingAddress ?? 'No address'}
							</CardDescription>
						</div>

						<OrderStatusSelect
							defaultOrderStatus={response.order.status!}
							orderId={response.order.id}
						/>
					</CardHeader>
					<CardContent>
						<Table>
							<TableCaption>
								Order date:{' '}
								<time
									dateTime={response.order.createdAt?.toISOString()}
									className='font-medium'
								>
									{formatDate(response.order.createdAt!)}
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
