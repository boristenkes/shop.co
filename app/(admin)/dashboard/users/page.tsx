import ErrorMessage from '@/components/error-message'
import { getUsers } from '@/features/user/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { notFound } from 'next/navigation'
import { columns } from './columns'
import { UsersTable } from './users-table'

export default async function UsersPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'users', ['read']))
		notFound()

	const response = await getUsers()

	return (
		<div className='space-y-8 container'>
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
