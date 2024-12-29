import { getUsers } from '@/features/user/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { SearchParams } from '@/lib/types'
import { Loader2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { UsersTable } from './users-table'

export default async function UsersPage(props: {
	searchParams: Promise<SearchParams>
}) {
	const session = await auth()

	const currentUser = session?.user

	if (!hasPermission(currentUser?.role!, 'users', ['read'])) notFound()

	const searchParams = await props.searchParams
	const currentPage = Number(searchParams.page ?? '1')

	const response = await getUsers({ page: currentPage })

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl font-bold'>Users Management</h1>

			<Suspense fallback={<Loader2Icon className='animate-spin mx-auto' />}>
				<UsersTable
					initialPage={currentPage}
					initialData={response}
				/>
			</Suspense>
		</div>
	)
}
