import { db } from '@/db'
import { notFound, redirect } from 'next/navigation'

export default async function ProductSlugPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await params).slug
	const product = await db.query.products.findFirst({
		where: (products, { eq }) => eq(products.slug, slug),
		columns: { id: true }
	})

	if (!product?.id) notFound()

	redirect(`/products/${slug}/${product.id}`)
}
