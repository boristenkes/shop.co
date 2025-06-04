import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { getCoupons } from '@/features/coupon/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { columns } from './columns'
import { CouponsTable } from './table'

export const metadata = {
	title: 'Coupons'
}

export default async function PromoCodesPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['read']))
		notFound()

	const response = await getCoupons()

	return (
		<div className='container space-y-8'>
			<div className='flex justify-between items-center gap-2 flex-wrap'>
				<h1 className='text-3xl font-bold'>Coupons Management</h1>

				{hasPermission(currentUser.role, 'coupons', ['create']) && (
					<Button
						asChild
						className='ml-auto'
					>
						<Link href='/dashboard/coupons/new'>
							Add Coupon <PlusIcon />
						</Link>
					</Button>
				)}
			</div>

			{response.success ? (
				<CouponsTable
					data={response.coupons}
					columns={columns}
				/>
			) : (
				<ErrorMessage message='Something went wrong' />
			)}
		</div>
	)
}
