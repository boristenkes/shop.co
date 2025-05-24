import { Button } from '@/components/ui/button'
import Paragraph from '@/components/utils/paragraph'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
	return (
		<main className='container py-16'>
			<div className='text-center'>
				<h1 className='text-5xl'>Your payment was canceled </h1>
				<Paragraph className='mx-auto mt-4'>
					No worries — you can complete your order anytime
				</Paragraph>

				<div className='flex items-center gap-4 mt-8 mx-auto w-fit'>
					<Button
						asChild
						variant='outline'
					>
						<Link href='/products'>Continue shopping</Link>
					</Button>

					<Button asChild>
						<Link href='/cart'>
							Return to cart <ArrowRightIcon className='size-4' />
						</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}
