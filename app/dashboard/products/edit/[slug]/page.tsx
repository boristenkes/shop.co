import ErrorMessage from '@/components/error-message'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { getCategories } from '@/features/category/lib/actions'
import { getProductBySlug } from '@/features/product/actions'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import ProductForm from '../../_components/product-form'

export const metadata: Metadata = {
	title: 'Edit Product'
}

export default async function EditProductPage({
	params: { slug }
}: {
	params: { slug: string }
}) {
	const [product, categories] = await Promise.all([
		getProductBySlug(slug),
		getCategories()
	])

	if (!product)
		return (
			<ErrorMessage message='Something went wrong. Please try again later.' />
		)

	return (
		<main className='container py-16'>
			<div className='grid gap-1 mb-8'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						size='icon'
						className='size-9'
					>
						<ChevronLeftIcon className='size-5' />
						<span className='sr-only'>Back</span>
					</BackButton>
					<h1 className='text-3xl font-semibold tracking-tight'>
						Edit product
					</h1>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardDescription>
						Make your changes here. Click save when you're done.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductForm
						categories={categories}
						isEdit={true}
						product={product}
					/>
				</CardContent>
			</Card>
		</main>
	)
}
