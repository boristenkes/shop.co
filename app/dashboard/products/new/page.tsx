import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import NewProductForm from './_components/new-product-form'

export const metadata: Metadata = {
	title: 'Create Product'
}

export default function NewProductPage() {
	return (
		<main className='container py-16'>
			<div className='grid gap-1 mb-8'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						size='icon'
						className='size-9'
					>
						<ChevronLeftIcon className='size-5' />
						<span className='sr-only'>Back</span>
					</BackButton>
					<h1 className='text-3xl font-semibold tracking-tight'>
						Create product
					</h1>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<NewProductForm />
				</CardContent>
			</Card>
		</main>
	)
}
