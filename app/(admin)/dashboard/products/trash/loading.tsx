import TableSkeleton from '@/components/skeletons/table'
import { BackButton } from '@/components/utils/back-button'
import { ArrowLeft } from 'lucide-react'

export default function ProductsTrashLoading() {
	return (
		<div className='space-y-8 container'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						className='rounded-sm text-sm'
						size='icon'
					>
						<ArrowLeft />
					</BackButton>
					<h1 className='text-3xl font-bold'>Trash</h1>
				</div>
			</div>

			<TableSkeleton />
		</div>
	)
}
