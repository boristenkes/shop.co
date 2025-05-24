import { Button } from '@/components/ui/button'
import Paragraph from '@/components/utils/paragraph'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
	return (
		<main className='container py-16'>
			<div className='text-center'>
				<h1 className='text-5xl flex flex-wrap justify-center gap-2'>
					<span>🎊</span> Thank you for your purchase! <span>🎉</span>
				</h1>
				<Paragraph className='mx-auto mt-4'>
					We&apos;ve emailed you a receipt and will notify you when your order
					ships. If you have any questions, feel free to reach out to our
					support team.
				</Paragraph>

				<div className='flex items-center gap-4 mt-8 mx-auto w-fit'>
					<Button
						asChild
						variant='outline'
					>
						<Link href='/products'>Continue shopping</Link>
					</Button>

					<Button asChild>
						<Link href='/orders'>
							View order <ArrowRightIcon className='size-4' />
						</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}
