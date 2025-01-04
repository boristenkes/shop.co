import ErrorMessage from '@/components/error-message'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { getCategories } from '@/features/category/actions'
import { getColors } from '@/features/color/actions'
import { getProductBySlug } from '@/features/product/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { EditProductForm } from './form'

export default async function EditProductPage(props: {
	params: Promise<{ slug: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, 'products', ['update']))
		notFound()

	const slug = (await props.params).slug
	const [productResponse, getCategoriesResponse, getColorsResponse] =
		await Promise.all([getProductBySlug(slug), getCategories(), getColors()])

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
				<h1 className='text-3xl font-bold'>Edit Product</h1>
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
