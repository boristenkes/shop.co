import { Skeleton } from '@/components/ui/skeleton'

export default function ProductFAQsLoading() {
	return (
		<div className='container-sm space-y-8'>
			<Skeleton className='w-80 h-8 rounded-sm' />

			<div className='divide-y'>
				<div className='flex items-center justify-between w-full py-4'>
					<Skeleton className='w-64 h-5 rounded-sm' />
					<Skeleton className='size-4' />
				</div>
				<div className='flex items-center justify-between w-full py-4'>
					<Skeleton className='w-48 h-5 rounded-sm' />
					<Skeleton className='size-4' />
				</div>
				<div className='flex items-center justify-between w-full py-4'>
					<Skeleton className='w-56 h-5 rounded-sm' />
					<Skeleton className='size-4' />
				</div>
				<div className='flex items-center justify-between w-full py-4'>
					<Skeleton className='w-64 h-5 rounded-sm' />
					<Skeleton className='size-4' />
				</div>
				<div className='flex items-center justify-between w-full py-4'>
					<Skeleton className='w-48 h-5 rounded-sm' />
					<Skeleton className='size-4' />
				</div>
			</div>
		</div>
	)
}
