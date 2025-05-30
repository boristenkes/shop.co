import ErrorMessage from '@/components/error-message'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'
import { getProductFAQs } from '@/features/faq/actions/read'

export default async function ProductPageFAQ(props: {
	params: Promise<{ slug: string; id: string }>
}) {
	const productId = (await props.params).id
	const response = await getProductFAQs(Number(productId))

	return (
		<div className='container-sm space-y-8'>
			<h2 className='text-2xl font-bold'>Frequently Asked Questions</h2>

			{response.success ? (
				response.faqs.length > 0 ? (
					<Accordion type='single'>
						{response.faqs.map(faq => (
							<AccordionItem
								key={faq.id}
								value={faq.id.toString()}
							>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				) : (
					<p className='p-16 text-center'>
						This product doesn&apos;t have any FAQs
					</p>
				)
			) : (
				<ErrorMessage message={response.message ?? 'Something went wrong'} />
			)}
		</div>
	)
}
