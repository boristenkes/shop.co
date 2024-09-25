import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { PlusCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Products'
}

export default function DashboardProductsPage() {
	return (
		<main className='grid flex-1 items-start gap-4 p-4 sm:px-6'>
			<Card>
				<CardHeader>
					<div className='flex items-center gap-4 justify-between'>
						<div className='grid gap-2'>
							<CardTitle>
								Products <span>(5)</span>
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
					<DataTable />
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
