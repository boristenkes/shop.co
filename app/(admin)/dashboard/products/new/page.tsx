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
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { NewProductForm } from './form'

export default async function NewProductPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'products', ['create']))
		notFound()

	const [categoriesResponse, colorsResponse] = await Promise.all([
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
				<h1 className='text-3xl font-bold'>Add New Product</h1>
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
					<NewProductForm
						getCategoriesResponse={categoriesResponse}
						getColorsResponse={colorsResponse}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
