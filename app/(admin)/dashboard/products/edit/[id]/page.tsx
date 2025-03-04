import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { getCategories } from '@/features/category/actions/read'
import { getColors } from '@/features/color/actions/read'
import { getProductById } from '@/features/product/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EditProductForm } from './form'

export default async function EditProductPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'products', ['update']))
		notFound()

	const id = (await props.params).id
	const [productResponse, getCategoriesResponse, getColorsResponse] =
		await Promise.all([
			getProductById(parseInt(id)),
			getCategories(),
			getColors()
		])

	return (
		<div
			className='space-y-8 container'
			style={{ '--max-width': `960px` } as React.CSSProperties}
		>
			<div className='space-y-8'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Edit Product</h1>
					{productResponse.success && (
						<Button
							variant='outline'
							asChild
						>
							<Link href={`/products/${productResponse.product.slug}/${id}`}>
								Go to Product Page
							</Link>
						</Button>
					)}
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardDescription>
						Enter product details in form below. Click create when you&apos;re
						done.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{productResponse.success ? (
						<EditProductForm
							product={productResponse.product}
							getCategoriesResponse={getCategoriesResponse}
							getColorsResponse={getColorsResponse}
						/>
					) : (
						<ErrorMessage message={productResponse.message} />
					)}
				</CardContent>
			</Card>
		</div>
	)
}
