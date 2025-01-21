import { Button } from '@/components/ui/button'
import { ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react'
import ProductPageTabs from '../_components/tabs'
import ReviewButton from './review-button'

export default async function ProductPageReviews(props: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await props.params).slug

	return (
		<div className='container'>
			<ProductPageTabs slug={slug} />

			{/* <p className='p-16 text-center'>
				This product doesn&apos;t have any reviews
			</p> */}

			<div className='flex items-center justify-between gap-4'>
				<h2 className='text-2xl font-bold'>All Reviews</h2>

				<div className='flex items-center gap-2.5'>
					<Button
						size='icon'
						variant='secondary'
					>
						<SlidersHorizontalIcon />
					</Button>

					<Button variant='secondary'>
						Latest <ChevronDownIcon />
					</Button>

					<ReviewButton />
				</div>
			</div>
		</div>
	)
}
