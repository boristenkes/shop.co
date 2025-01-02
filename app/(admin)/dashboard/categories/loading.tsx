import TableSkeleton from '@/components/skeletons/table'

export default function CategoriesLoading() {
	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Categories Management</h1>

			<TableSkeleton />
		</div>
	)
}
