import { getProductBySlug } from '@/features/product/actions'
import { notFound } from 'next/navigation'

export default async function ProductPage(props: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await props.params)?.slug

	if (!slug) notFound()

	const response = await getProductBySlug(slug)

	if (!response.success) notFound()

	const { product } = response

	return (
		<div>
			{product.images.map(image => (
				<img
					key={image.url}
					src={image.url}
					alt={product.name}
				/>
			))}
			<h1>{product.name}</h1>
		</div>
	)
}
