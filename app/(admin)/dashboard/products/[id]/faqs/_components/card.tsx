'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductFAQ } from '@/db/schema/product-faqs'
import { EditIcon, Trash2Icon } from 'lucide-react'
import { ComponentProps } from 'react'
import { DeleteProductFAQButton, EditProductFAQButton } from './buttons'

export type FAQCardProps = ComponentProps<typeof Card> & {
	faq: ProductFAQ
}

export default function FAQCard({ faq, ...props }: FAQCardProps) {
	return (
		<Card {...props}>
			<CardHeader>
				<div className='flex items-center justify-between gap-4'>
					<CardTitle>{faq.question}</CardTitle>

					<div className='flex items-center gap-2'>
						<EditProductFAQButton faq={faq}>
							<Button
								size='icon'
								variant='ghost'
							>
								<EditIcon className='size-4' />
							</Button>
						</EditProductFAQButton>
						<DeleteProductFAQButton faqId={faq.id}>
							<Button
								size='icon'
								variant='ghost'
							>
								<Trash2Icon className='size-4' />
							</Button>
						</DeleteProductFAQButton>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p>{faq.answer}</p>
			</CardContent>
		</Card>
	)
}
