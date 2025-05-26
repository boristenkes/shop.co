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
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import Avatar from '@/components/utils/avatar'
import { BackButton } from '@/components/utils/back-button'
import { getCart } from '@/features/cart/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatPrice, getTimeDistanceFromNow } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CartDetailsPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'carts', ['read']))
		notFound()

	const cartId = (await props.params).id
	const response = await getCart(Number(cartId))

	const totalPriceInCents = response.success
		? response.cart.cartItems.reduce(
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
				<h1 className='text-4xl font-bold'>Cart Details</h1>
			</div>

			{response.success ? (
				<Card>
					<CardHeader className='flex items-start justify-between flex-row'>
						<div>
							<CardTitle>Cart ID: {response.cart.id}</CardTitle>
							<CardDescription className='mt-2'>
								Opened:{' '}
								<time
									dateTime={response.cart.createdAt?.toISOString()}
									className='font-medium'
								>
									{getTimeDistanceFromNow(response.cart.createdAt!)}
								</time>
								<br />
								Last Update:{' '}
								<time
									dateTime={response.cart.updatedAt?.toISOString()}
									className='font-medium'
								>
									{getTimeDistanceFromNow(response.cart.updatedAt!)}
								</time>
							</CardDescription>
						</div>

						<Link
							href={`/dashboard/users/${response.cart.user.id}`}
							className='flex items-center gap-2'
						>
							<div className='grid text-right'>
								<strong>{response.cart.user.name}</strong>
								<p className='text-sm'>{response.cart.user.email}</p>
							</div>
							<Avatar
								src={response.cart.user.image!}
								alt={response.cart.user.name}
								width={48}
								height={48}
							/>
						</Link>
					</CardHeader>
					<CardContent>
						{response.cart.cartItems.length > 0 ? (
							<Table>
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
									{response.cart.cartItems.map(item => (
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
											<TableCell>
												{formatPrice(item.productPriceInCents)}
											</TableCell>
											<TableCell>{item.quantity}</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className='bcart'
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
										<TableCell className='text-right'>
											{formatPrice(totalPriceInCents)}
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						) : (
							<p className='text-center py-16'>This cart is empty</p>
						)}
					</CardContent>
				</Card>
			) : (
				<ErrorMessage message={response.message ?? 'Something went wrong'} />
			)}
		</main>
	)
}
