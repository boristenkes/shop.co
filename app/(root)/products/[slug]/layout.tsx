import ErrorMessage from '@/components/error-message'
import { getProductBySlug } from '@/features/product/actions'
import { auth } from '@/lib/auth'
import ProductPageDetails from './_components/product-page-details'

export default async function ProductLayout({
	params,
	children
}: {
	params: Promise<{ slug: string }>
	children: React.ReactNode
}) {
	const session = await auth()
	const currentUser = session?.user
	const slug = (await params).slug

	const response = await getProductBySlug(slug)

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<div>
			<ProductPageDetails product={response.product} />

			{children}
		</div>
	)
}
