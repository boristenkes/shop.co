import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BackButton } from '@/components/utils/back-button'
import Paragraph from '@/components/utils/paragraph'
import { getProductByIdForAdmin } from '@/features/product/actions/read'
import { auth } from '@/lib/auth'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { formatDate, formatPrice } from '@/utils/format'
import {
	ArrowLeft,
	Calendar,
	Edit,
	Package,
	Star,
	TrendingUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductDetailsPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !['admin', 'moderator'].includes(currentUser.role))
		notFound()

	const productId = (await props.params).id
	const response = await getProductByIdForAdmin(Number(productId))

	if (!response.success)
		return <ErrorMessage message={response.message ?? 'Something went wrong'} />

	const product = response.product

	const discountedPrice = calculatePriceWithDiscount(
		product.priceInCents,
		product.discount!
	)

	return (
		<main className='container space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						className='rounded-sm text-sm'
					>
						<ArrowLeft /> Back
					</BackButton>

					<h1 className='text-3xl font-bold'>{product.name}</h1>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button asChild>
						<Link href={`/dashboard/products/edit/${product.id}`}>
							<Edit className='mr-2 h-4 w-4' />
							Edit Product
						</Link>
					</Button>
					<Button
						variant='outline'
						asChild
					>
						<Link href={`/products/${product.slug}/${product.id}`}>
							View in store
						</Link>
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Product Images */}
				<Card className='lg:col-span-1'>
					<CardHeader>
						<CardTitle>Product Images</CardTitle>
					</CardHeader>
					<CardContent className='grid gap-4'>
						{product.images.map((image, idx) => (
							<a
								key={image.id}
								href={image.url}
								target='_blank'
								className='relative hover:bg-neutral-100 transition-colors'
							>
								<Image
									src={image.url}
									alt={`${product.name} - Image ${idx + 1}`}
									width={462}
									height={224}
									className='w-full h-56 object-contain rounded-lg border'
								/>
							</a>
						))}
					</CardContent>
				</Card>

				{/* Product Details */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Product ID
									</label>
									<p className='text-lg font-semibold'>
										#{product.id.toString().padStart(5, '0')}
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Slug
									</label>
									<p className='text-lg'>{product.slug}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Category
									</label>
									<Badge variant='secondary'>
										{product.category?.name ?? <em>No category</em>}
									</Badge>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Status
									</label>
									<div className='flex gap-2'>
										{product.featured && (
											<Badge variant='default'>Featured</Badge>
										)}
										{product.archived ? (
											<Badge variant='destructive'>Archived</Badge>
										) : (
											<Badge variant='outline'>Active</Badge>
										)}
									</div>
								</div>
							</div>
							<Separator />
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Description
								</label>
								<Paragraph className='mt-1'>{product.description}</Paragraph>
							</div>
						</CardContent>
					</Card>

					{/* Pricing & Stock */}
					<Card>
						<CardHeader>
							<CardTitle>Pricing & Inventory</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Original Price
									</label>
									<p className='text-2xl font-bold'>
										{formatPrice(product.priceInCents)}
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Discount
									</label>
									<p className='text-2xl font-bold text-red-600'>
										{product.discount}%
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Final Price
									</label>
									<p className='text-2xl font-bold text-green-600'>
										{formatPrice(discountedPrice)}
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Stock
									</label>
									<div className='flex items-center gap-2'>
										<Package className='h-4 w-4' />
										<span className='text-lg font-semibold'>
											{product.stock} units
										</span>
									</div>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Total Sold
									</label>
									<div className='flex items-center gap-2'>
										<TrendingUp className='h-4 w-4' />
										<span className='text-lg font-semibold'>
											{product.totalSoldCount} units
										</span>
									</div>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Average Rating
									</label>
									<div className='flex items-center gap-2'>
										<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
										<span className='text-lg font-semibold'>
											{product.averageRating.toFixed(1)}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Variants */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Sizes */}
						<Card>
							<CardHeader>
								<CardTitle>Available Sizes</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-2'>
									{product.sizes!.map(size => (
										<Badge
											key={size}
											variant='outline'
											className='px-3 py-1'
										>
											{size}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Colors */}
						<Card>
							<CardHeader>
								<CardTitle>Available Colors</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									{product.productsToColors.map(productColor => (
										<div
											key={productColor.color.id}
											className='flex items-center gap-3'
										>
											<div
												className='w-6 h-6 rounded-full border-2 border-gray-300'
												style={{ backgroundColor: productColor.color.hexCode }}
											/>
											<span className='font-medium'>
												{productColor.color.name}
											</span>
											<Badge
												variant='outline'
												className='text-xs'
											>
												{productColor.color.hexCode}
											</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Timestamps */}
					<Card>
						<CardHeader>
							<CardTitle>Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='flex items-center gap-2'>
									<Calendar className='h-4 w-4 text-gray-500' />
									<div className='grid'>
										<label className='text-sm font-medium text-gray-500'>
											Created
										</label>
										<time
											dateTime={product.createdAt?.toISOString()}
											className='text-sm'
										>
											{formatDate(product.createdAt!)}
										</time>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<Calendar className='h-4 w-4 text-gray-500' />
									<div className='grid'>
										<label className='text-sm font-medium text-gray-500'>
											Last Updated
										</label>
										<time
											dateTime={product.updatedAt?.toISOString()}
											className='text-sm'
										>
											{formatDate(product.updatedAt!)}
										</time>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	)
}
