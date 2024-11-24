import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getProductsForAdmin } from '@/features/product/actions'
import { SearchParams } from '@/lib/types'
import { PlusCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { columns } from './columns'
import { ProductTable } from './product-table'

export const metadata: Metadata = {
	title: 'Products'
}

export default async function DashboardProductsPage({
	searchParams
}: {
	searchParams: SearchParams
}) {
	const page = parseInt(searchParams.page as string) || 1
	const response = await getProductsForAdmin({ page })

	if (!response.success) return <ErrorMessage message={response.message} />

	const { products } = response

	return (
		<main className='grid flex-1 items-start gap-4 p-4 sm:px-6'>
			<Card>
				<CardHeader>
					<div className='flex items-center gap-4 justify-between'>
						<div className='grid gap-2'>
							<CardTitle>
								Products <span>({products.length ?? 0})</span>
							</CardTitle>
							<CardDescription>
								Manage your products and view their sales performance.
							</CardDescription>
						</div>
						<Button
							size='sm'
							asChild
						>
							<Link href='/dashboard/products/new'>
								<PlusCircleIcon className='mr-2 h-4 w-4' />
								Add product
							</Link>
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ProductTable
						data={products}
						columns={columns}
					/>
				</CardContent>
				<CardFooter>
					<div className='text-xs text-muted-foreground'>
						Showing <strong>1-5</strong> of <strong>5</strong> products
					</div>
				</CardFooter>
			</Card>
		</main>
	)
}
