import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BackButton } from '@/components/utils/back-button'
import { ArrowLeft } from 'lucide-react'

export default function ProductsNewLoading() {
	return (
		<div
			className='space-y-8 container'
			style={{ '--max-width': `960px` } as React.CSSProperties}
		>
			<div className='space-y-8'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>
				<h1 className='text-3xl font-bold'>Add New Product</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardDescription>
						Enter product details in form below. Click create when you&apos;re
						done.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className='space-y-8'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
							<div className='space-y-3 w-full'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-10 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-10 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-10 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-10 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full col-span-2'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-24 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full col-span-full md:col-span-1'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<div className='flex flex-wrap gap-2'>
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
								</div>
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full col-span-full md:col-span-1'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<div className='flex flex-wrap gap-2'>
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
									<Skeleton className='h-10 w-16 rounded-full' />
								</div>
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<div className='space-y-3 w-full col-span-full'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='h-10 w-full rounded-sm' />
								<Skeleton className='h-4 w-32 rounded-sm' />
							</div>

							<Skeleton className='h-20 rounde-md col-span-full md:col-span-1' />
							<Skeleton className='h-20 rounde-md col-span-full md:col-span-1' />

							<div className='space-y-3 col-span-full md:col-span-1'>
								<Skeleton className='h-4 w-16 rounded-sm' />
								<Skeleton className='size-48 rounded-sm' />
								<Skeleton className='h-8 w-full rounded-full' />
							</div>
						</div>

						<Skeleton className='ml-auto h-10 w-24 rounded-full' />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
