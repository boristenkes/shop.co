import ErrorMessage from '@/components/error-message'
import { getUsers } from '@/features/user/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { SearchParams } from '@/lib/types'
import { notFound } from 'next/navigation'
import { columns } from './columns'
import { UsersTable } from './users-table'

export default async function UsersPage(props: {
	searchParams: Promise<SearchParams>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, 'users', ['read']))
		notFound()

	const searchParams = await props.searchParams
	const currentPage = Number(searchParams.page ?? '1')

	const response = await getUsers()

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl font-bold'>Users Management</h1>

			{response.success ? (
				<UsersTable
					data={response.users}
					columns={columns}
				/>
			) : (
				<ErrorMessage message={response.message} />
			)}
		</div>
	)
}
