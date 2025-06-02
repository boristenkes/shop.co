import { getOrderStatusColor } from '@/app/(root)/orders/order-list'
import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Avatar from '@/components/utils/avatar'
import { BackButton } from '@/components/utils/back-button'
import CopyButton from '@/components/utils/copy-button'
import DeleteCartButton from '@/features/cart/components/delete-cart-button'
import { getUserById, GetUserByIdUser } from '@/features/user/actions/read'
import DeleteUserButton from '@/features/user/components/delete-button'
import { auth } from '@/lib/auth'
import { Role } from '@/lib/enums'
import { hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { formatDate, formatId, formatPrice } from '@/utils/format'
import { getRoleBadgeVariant } from '@/utils/helpers'
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	DollarSign,
	Mail,
	MapPin,
	MessageSquare,
	Package,
	ShoppingCart,
	User,
	XCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RoleSelect from './_components/role-select'

export default async function UserDetailsPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'users', ['read']))
		notFound()

	const userId = Number((await props.params).id)

	if (!userId) return <ErrorMessage message='Invalid user ID' />

	const response = await getUserById(userId)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const user = response.user

	return (
		<main className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						className='rounded-sm text-sm'
					>
						<ArrowLeft /> Back
					</BackButton>
					<h1 className='text-3xl font-bold'>{user.name}</h1>
				</div>

				<DeleteUserButton userId={user.id} />
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* User Profile */}
				<div className='space-y-6'>
					<UserProfile
						user={user}
						currentUserRole={currentUser.role}
					/>
					<UserCart cart={user.cart} />
				</div>

				{/* User Activity */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Statistics */}
					<UserStatistic user={user} />

					{/* Recent Orders */}
					<UserOrders orders={user.orders} />

					{/* User Reviews */}
					<UserReviews reviews={user.reviews} />
				</div>
			</div>
		</main>
	)
}

function UserStatistic({ user }: { user: GetUserByIdUser }) {
	const totalSpent = user.orders.reduce((acc, curr) => {
		if (['pending', 'canceled'].includes(curr.status!)) return acc

		return acc + curr.totalPriceInCents
	}, 0)

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<Card>
				<CardContent className='p-4'>
					<div className='flex items-center gap-2'>
						<ShoppingCart className='h-5 w-5 text-blue-600' />
						<div>
							<p className='text-sm font-medium text-gray-500'>Total Orders</p>
							<p className='text-2xl font-bold'>{user.orders.length}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='p-4'>
					<div className='flex items-center gap-2'>
						<MessageSquare className='h-5 w-5 text-green-600' />
						<div>
							<p className='text-sm font-medium text-gray-500'>Total Reviews</p>
							<p className='text-2xl font-bold'>{user.reviews.length}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='p-4'>
					<div className='flex items-center gap-2'>
						<DollarSign className='h-5 w-5 text-purple-600' />
						<div>
							<p className='text-sm font-medium text-gray-500'>Total Spent</p>
							<p className='text-2xl font-bold'>{formatPrice(totalSpent)}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

function UserProfile({
	user,
	currentUserRole
}: {
	user: GetUserByIdUser
	currentUserRole: Role
}) {
	return (
		<Card className='lg:col-span-1'>
			<CardHeader>
				<CardTitle>User Profile</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex flex-col items-center space-y-4'>
					<Avatar
						src={user.image!}
						alt={user.name}
						width={96}
						height={96}
						className='w-24 h-24'
					/>
					<div className='text-center'>
						<h3 className='text-xl font-semibold'>{user.name}</h3>
						{user.role !== 'admin' &&
						hasPermission(currentUserRole, 'users', ['update']) ? (
							<RoleSelect
								userId={user.id}
								defaultRole={user.role}
							/>
						) : (
							<Badge
								variant={getRoleBadgeVariant(user.role)}
								className='mt-2 capitalize'
							>
								{user.role}
							</Badge>
						)}
					</div>
				</div>

				<Separator />

				<div className='space-y-3'>
					<div className='flex items-center gap-2'>
						<User className='h-4 w-4 text-gray-500' />
						<div>
							<label className='text-sm font-medium text-gray-500'>
								User ID
							</label>
							<p className='text-sm'>{formatId(user.id)}</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<Mail className='h-4 w-4 text-gray-500' />
						<div>
							<label className='text-sm font-medium text-gray-500'>Email</label>
							<div className='flex items-center gap-2'>
								<a
									href={`mailto:${user.email}`}
									className='hover:underline'
								>
									{user.email}
								</a>
								<CopyButton text={user.email} />
							</div>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<Calendar className='h-4 w-4 text-gray-500' />
						<div className='grid'>
							<label className='text-sm font-medium text-gray-500'>
								Member Since
							</label>
							<time
								dateTime={user.createdAt?.toISOString()}
								className='text-sm'
							>
								{formatDate(user.createdAt!)}
							</time>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function UserReviews({ reviews }: { reviews: GetUserByIdUser['reviews'] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>User Reviews</CardTitle>
			</CardHeader>
			<CardContent>
				{reviews.length > 0 ? (
					<div className='space-y-4'>
						{reviews.map(review => (
							<div
								key={review.id}
								className='border rounded-lg p-4'
							>
								<div className='flex flex-col sm:flex-row gap-4'>
									<Link
										href={`/dashboard/products/${review.product.id}`}
										className='flex-shrink-0'
									>
										<Image
											src={review.product.images[0].url}
											alt={review.product.name}
											width={64}
											height={64}
											className='size-16 object-contain rounded-lg'
										/>
									</Link>
									<div className='flex-1'>
										<div className='flex flex-col sm:flex-row justify-between items-start gap-2'>
											<div>
												<h4 className='font-semibold'>{review.product.name}</h4>
												<div className='flex items-center gap-2 mt-1'>
													<div className='flex'>
														<Rating rating={review.rating} />
													</div>
													<span className='text-sm text-gray-500'>
														{review.rating}/5
													</span>
													{review.approved ? (
														<CheckCircle className='h-4 w-4 text-green-500' />
													) : (
														<XCircle className='h-4 w-4 text-red-500' />
													)}
													<Badge
														variant={
															review.approved ? 'default' : 'destructive'
														}
														className='text-xs'
													>
														{review.approved ? 'Approved' : 'Pending'}
													</Badge>
												</div>
											</div>
											<time
												dateTime={review.createdAt?.toISOString()}
												className='text-sm text-gray-500'
											>
												{formatDate(review.createdAt!)}
											</time>
										</div>
										<p className='text-gray-700 mt-2'>{review.comment}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-500 text-center py-4'>No reviews found</p>
				)}
			</CardContent>
		</Card>
	)
}

function UserOrders({ orders }: { orders: GetUserByIdUser['orders'] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Orders</CardTitle>
			</CardHeader>
			<CardContent>
				{orders.length > 0 ? (
					<div className='space-y-4'>
						{orders.map(order => (
							<div
								key={order.id}
								className='border rounded-lg p-4'
							>
								<div className='flex flex-col sm:flex-row justify-between items-start gap-2'>
									<div>
										<div className='flex items-center gap-2'>
											<h4 className='font-semibold hover:underline'>
												<Link href={`/dashboard/orders/${order.id}`}>
													Order {formatId(order.id)}
												</Link>
											</h4>
											<Badge
												className='capitalize flex items-center gap-1 w-fit'
												variant='outline'
											>
												<div
													className={cn(
														'size-2 rounded-full',
														getOrderStatusColor(order.status)
													)}
												/>
												{order.status}
											</Badge>
										</div>
										<div className='flex items-center gap-2 mt-1 text-sm text-gray-500'>
											<Calendar className='h-4 w-4' />
											<time dateTime={order.createdAt?.toISOString()}>
												{formatDate(order.createdAt!)}
											</time>
										</div>
									</div>
									<p className='font-semibold'>
										{formatPrice(order.totalPriceInCents)}
									</p>
								</div>
								<div className='flex items-start gap-2 mt-2'>
									<MapPin className='h-4 w-4 text-gray-500 mt-0.5' />
									<p className='text-sm text-gray-600'>
										{order.shippingAddress}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-500 text-center py-4'>No orders found</p>
				)}
			</CardContent>
		</Card>
	)
}

function UserCart({ cart }: { cart: GetUserByIdUser['cart'] }) {
	if (!cart || !cart.cartItems.length) return null

	const totalValue = cart.cartItems.reduce(
		(acc, curr) => acc + curr.productPriceInCents * curr.quantity,
		0
	)

	return (
		<Card>
			<CardHeader className='flex items-center justify-between flex-row'>
				<CardTitle className='flex items-center gap-2'>
					<ShoppingCart className='size-5' />
					Shopping Carts
				</CardTitle>
				<DeleteCartButton cartId={cart.id} />
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Cart Summary */}
				<div className='grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg'>
					<div className='flex items-center gap-2'>
						<Package className='h-4 w-4 text-blue-600' />
						<div>
							<p className='text-sm font-medium text-gray-500'>Total Items</p>
							<p className='text-lg font-bold'>{cart.cartItems.length}</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<DollarSign className='h-4 w-4 text-green-600' />
						<div>
							<p className='text-sm font-medium text-gray-500'>Total Value</p>
							<p className='text-lg font-bold'>{formatPrice(totalValue)}</p>
						</div>
					</div>
				</div>

				<Separator />

				{/* Cart Items */}
				<div className='space-y-3'>
					<h4 className='font-medium text-gray-700'>Cart Items</h4>
					{cart.cartItems.map(item => (
						<div
							key={item.id}
							className='border rounded-lg p-3'
						>
							<div className='flex gap-3'>
								<Link
									href={`/dashboard/products/${item.product.id}`}
									className='flex-shrink-0'
								>
									<Image
										width={48}
										height={48}
										src={item.product.images[0].url}
										alt={item.product.name}
										className='size-12 object-contain rounded-md'
									/>
								</Link>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center justify-between gap-2'>
										<h5 className='font-medium text-sm truncate'>
											{item.product.name}
										</h5>
										<span className='text-sm text-gray-500'>
											Qty: {item.quantity}
										</span>
									</div>
									<div className='flex items-center gap-2 mt-1'>
										<Badge
											variant='outline'
											className='text-xs'
										>
											Size: {item.size}
										</Badge>
										<div className='flex items-center gap-1'>
											<div
												className='w-3 h-3 rounded-full border'
												style={{ backgroundColor: item.color.hexCode }}
											/>
											<span className='text-xs text-gray-500'>
												{item.color.name}
											</span>
										</div>
									</div>
									<div className='flex justify-between items-center mt-2'>
										<span className='font-medium text-sm'>
											{formatPrice(item.productPriceInCents * item.quantity)}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<Separator />

				{/* Cart Timestamps */}
				<div className='space-y-2'>
					<div className='flex items-center gap-2 text-sm text-gray-500'>
						<Calendar className='h-4 w-4' />
						<span>Created: {new Date(cart.createdAt!).toLocaleString()}</span>
					</div>
					<div className='flex items-center gap-2 text-sm text-gray-500'>
						<Calendar className='h-4 w-4' />
						<span>
							Last Updated: {new Date(cart.updatedAt!).toLocaleString()}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
