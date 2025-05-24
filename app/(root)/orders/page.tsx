import ErrorMessage from '@/components/error-message'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { getUserOrders } from '@/features/orders/actions/read'
import { integralCf } from '@/lib/fonts'
import { delay } from '@/lib/utils'
import Link from 'next/link'
import OrderList from './order-list'

export default async function OrdersPage() {
	await delay(5000)

	const response = await getUserOrders()

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

			{response.success ? (
				<OrderList orders={response.orders} />
			) : (
				<ErrorMessage message={response.message ?? 'Something went wrong'} />
			)}
		</main>
	)
}
