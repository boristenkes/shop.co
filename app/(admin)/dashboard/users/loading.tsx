import TableSkeleton from '@/components/skeletons/table'

export default function UsersLoading() {
	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Users Management</h1>

			<TableSkeleton />
		</div>
	)
}
