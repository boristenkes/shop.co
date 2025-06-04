import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getProductsForAdmin } from '@/features/product/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { columns } from './columns'
import { ProductsTable } from './products-table'

export const metadata = {
	title: 'Products'
}

export default async function ProductsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !['admin', 'moderator'].includes(currentUser.role))
		notFound()

	const response = await getProductsForAdmin()

	return (
		<div className='space-y-8 container'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Products Management</h1>
				<div className='flex items-center gap-2'>
					<Button
						asChild
						variant='outline'
					>
						<Link href='/dashboard/products/trash'>
							<Trash2Icon />
							Trash
						</Link>
					</Button>
					{hasPermission(currentUser.role, 'products', ['create']) && (
						<Button asChild>
							<Link href='/dashboard/products/new'>Add Product</Link>
						</Button>
					)}
				</div>
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
