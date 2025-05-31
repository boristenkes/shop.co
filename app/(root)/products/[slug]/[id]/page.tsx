import ErrorMessage from '@/components/error-message'
import { db } from '@/db'
import { getProductDescription } from '@/features/product/actions/read'

export async function generateStaticParams() {
	const products = await db.query.products.findMany({
		columns: { id: true, slug: true },
		where: (product, { and, isNull, eq }) =>
			and(isNull(product.deletedAt), eq(product.archived, false))
	})

	if (!products) return []

	return products.map(product => ({
		id: product.id.toString(),
		slug: product.slug
	}))
}

export default async function ProductPage(props: {
	params: Promise<{ slug: string; id: string }>
}) {
	const productId = (await props.params).id
	const response = await getProductDescription(Number(productId))

	if (!response.success)
		return (
			<ErrorMessage
				message='Something went wrong'
				className='container'
			/>
		)

	return (
		<div className='container'>
			{response.product.detailsHTML ? (
				<div
					dangerouslySetInnerHTML={{ __html: response.product.detailsHTML }}
					className='rich-text'
				/>
			) : (
				<p className='p-16 text-center'>
					This product doesn&apos;t have detailed description
				</p>
			)}
		</div>
	)
}
