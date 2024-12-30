import ErrorMessage from '@/components/error-message'
import { getCategories } from '@/features/category/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { SearchParams } from '@/lib/types'
import { notFound } from 'next/navigation'
import { CategoriesTable } from './categories-table'
import { columns } from './columns'
import NewCategoryButton from './components'

export default async function CategoriesPage(props: {
	searchParams: Promise<SearchParams>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, 'categories', ['read']))
		notFound()

	const searchParams = await props.searchParams
	const currentPage = Number(searchParams.page || '1')

	const response = await getCategories()

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Categories Management</h1>
				{hasPermission(currentUser.role!, 'categories', ['create']) && (
					<NewCategoryButton />
				)}
			</div>

			{response.success ? (
				<CategoriesTable
					data={response.categories}
					columns={columns}
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}
		</div>
	)
}
