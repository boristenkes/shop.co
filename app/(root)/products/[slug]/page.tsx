import { getProductBySlug, getProductSlugs } from '@/features/product/actions'
import { absoluteUrl, limitTextLength } from '@/lib/utils'
import { Metadata } from 'next'

export async function generateStaticParams() {
	const slugs = await getProductSlugs()

	if (!slugs) return []

	return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const slug = (await props.params).slug
	const response = await getProductBySlug(slug)

	if (!response.success) return {}

	const { product } = response

	const title = limitTextLength(product.name, 50)
	const description = limitTextLength(product.description ?? '', 150)

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: absoluteUrl(`/products/${slug}`),
			images: product.images.map(image => image.url)
		}
	}
}

export default function ProductPage() {
	return <div>ProductPage</div>
}
