import TableSkeleton from '@/components/skeletons/table'

export default function ProductsLoading() {
	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Products Management</h1>

			<TableSkeleton />
		</div>
	)
}
