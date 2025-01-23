import { db } from '@/db'

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
	return (
		<div className='container'>
			<p className='p-16 text-center'>
				This product doesn&apos;t have detailed description
			</p>
		</div>
	)
}
