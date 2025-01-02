import TableSkeleton from '@/components/skeletons/table'

export default function OrdersLoading() {
	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold flex items-center gap-2'>
				Orders Management
			</h1>

			<TableSkeleton />
		</div>
	)
}
