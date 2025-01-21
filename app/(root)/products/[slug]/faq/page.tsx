import ProductPageTabs from '../_components/tabs'

export default async function ProductPageFAQ(props: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await props.params).slug
	return (
		<div className='container'>
			<ProductPageTabs slug={slug} />

			<p className='p-16 text-center'>
				This product doesn&apos;t have any FAQs
			</p>
		</div>
	)
}
