import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/utils/back-button'
import { getDeletedProducts } from '@/features/product/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ProductsTable } from '../products-table'
import { columns } from './columns'

export default async function DeletedProductsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, 'products', ['delete']))
		notFound()

	const response = await getDeletedProducts()

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

				<Button>Empty</Button>
			</div>

			{response.success ? (
				<ProductsTable
					data={response.products}
					columns={columns}
				/>
			) : (
				<ErrorMessage message={response.message!} />
			)}
		</div>
	)
}
