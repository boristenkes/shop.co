import ErrorMessage from '@/components/error-message'
import { getAllCarts } from '@/features/cart/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { notFound } from 'next/navigation'
import { columns } from './columns'
import { CartsTable } from './table'

export default async function CartsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'carts', ['read']))
		notFound()

	const response = await getAllCarts()

	return (
		<div className='space-y-8 container'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<h1 className='text-3xl font-bold'>Carts Management</h1>
			</div>

			{response.success ? (
				<CartsTable
					data={response.carts}
					columns={columns}
				/>
			) : (
				<ErrorMessage message='Something went wrong' />
			)}
		</div>
	)
}
