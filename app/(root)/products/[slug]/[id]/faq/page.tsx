export default async function ProductPageFAQ(props: {
	params: Promise<{ slug: string; id: string }>
}) {
	return (
		<div className='container'>
			<p className='p-16 text-center'>
				This product doesn&apos;t have any FAQs
			</p>
		</div>
	)
}
