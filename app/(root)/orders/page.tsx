import ErrorMessage from '@/components/error-message'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { getOwnOrders } from '@/features/orders/actions/read'
import { auth } from '@/lib/auth'
import { integralCf } from '@/lib/fonts'
import { hasPermission } from '@/lib/permissions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import OrderList from './order-list'

export default async function OrdersPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'orders', ['read:own']))
		redirect('/')

	const response = await getOwnOrders()

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
