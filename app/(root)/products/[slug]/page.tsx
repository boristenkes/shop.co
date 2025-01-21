import { getProductBySlug, getProductSlugs } from '@/features/product/actions'
import { absoluteUrl, limitTextLength } from '@/lib/utils'
import { Metadata } from 'next'
import ProductPageTabs from './_components/tabs'

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

export default async function ProductPage(props: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await props.params).slug

	return (
		<div className='container'>
			<ProductPageTabs slug={slug} />
			<p className='p-16 text-center'>
				This product doesn&apos;t have detailed description
			</p>
		</div>
	)
}
