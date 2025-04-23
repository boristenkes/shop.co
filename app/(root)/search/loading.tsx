import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardListSkeleton } from '@/features/product/components/product-list'

export default function SearchPageLoading() {
	return (
		<main className='container py-16'>
			<div className='text-center'>
				<Skeleton className='w-[17.125rem] h-10 rounded-lg mx-auto mb-2' />
				<Skeleton className='w-[17.5rem] h-6 rounded-lg mx-auto' />

				<div className='relative max-w-2xl mx-auto mt-6'>
					<Skeleton className='absolute left-4 top-1/2 -translate-y-1/2 size-4' />
					<Skeleton className='w-[42rem] h-[2.625rem] rounded-full' />
				</div>
			</div>

			<ProductCardListSkeleton itemCount={6} />
		</main>
	)
}
