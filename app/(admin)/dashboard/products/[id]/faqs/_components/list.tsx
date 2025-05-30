import { Button } from '@/components/ui/button'
import { ProductFAQ } from '@/db/schema/product-faqs'
import { Product } from '@/db/schema/products'
import { PlusIcon } from 'lucide-react'
import { AddProductFAQButton } from './buttons'
import FAQCard from './card'

export default async function FAQList({
	faqs,
	productId
}: {
	faqs: ProductFAQ[]
	productId: Product['id']
}) {
	if (!faqs.length)
		return (
			<p className='text-center py-16 text-lg'>
				This product doesn&apos;t have any FAQs
			</p>
		)

	return (
		<ul className='py-8 space-y-4'>
			{faqs.map(faq => (
				<li key={faq.id}>
					<FAQCard faq={faq} />
				</li>
			))}
			<li>
				<AddProductFAQButton productId={productId}>
					<Button
						variant='outline'
						size='lg'
						className='flex items-center gap-2 mx-auto'
					>
						Add New <PlusIcon className='size-4' />
					</Button>
				</AddProductFAQButton>
			</li>
		</ul>
	)
}
