import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { integralCf } from '@/lib/fonts'
import Link from 'next/link'
import { OrderListSkeleton } from './order-list'

export default function OrdersPageLoading() {
	return (
		<main className='container pt-6'>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link
								href='/'
								className='text-base'
							>
								Home
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Orders</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<h1
				className={`${integralCf.className} text-4xl uppercase font-bold mt-6`}
			>
				Your orders
			</h1>

			<OrderListSkeleton itemCount={3} />
		</main>
	)
}
