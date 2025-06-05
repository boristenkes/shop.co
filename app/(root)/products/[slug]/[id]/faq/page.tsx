import ErrorMessage from '@/components/error-message'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getProductFAQs } from '@/features/faq/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export default async function ProductPageFAQ(props: {
	params: Promise<{ slug: string; id: string }>
}) {
	const productId = (await props.params).id
	const [currentUser, response] = await Promise.all([
		auth().then(session => session?.user),
		getProductFAQs(Number(productId))
	])

	return (
		<div className='container-sm space-y-8'>
			<div className='flex items-center gap-2'>
				<h2 className='text-2xl font-bold'>Frequently Asked Questions</h2>
				{hasPermission(currentUser?.role!, 'products', ['update']) && (
					<Button
						variant='ghost'
						size='icon'
						asChild
					>
						<Link href={`/dashboard/products/${productId}/faqs`}>
							<EditIcon className='size-4' />
						</Link>
					</Button>
				)}
			</div>

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
