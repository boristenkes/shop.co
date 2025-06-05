import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { DEMO_RESTRICTIONS } from '@/constants'
import { countDemoCoupons } from '@/features/coupon/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { AlertTriangleIcon, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import NewCouponForm from './form'

export const metadata = {
	title: 'Create Coupon'
}

export default async function NewCouponPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['read']))
		notFound()

	const response = await countDemoCoupons()

	return (
		<div
			className='space-y-8 container'
			style={{ '--max-width': `960px` } as React.CSSProperties}
		>
			<div className='flex items-center gap-4'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>
				<h1 className='text-3xl font-bold'>Add New Coupon</h1>
			</div>

			{response.success && response.count >= DEMO_RESTRICTIONS.MAX_COUPONS && (
				<Alert variant='warning'>
					<AlertTriangleIcon className='size-4' />
					<AlertTitle>Warning</AlertTitle>
					<AlertDescription>
						Demo limit reached. Please delete one of the coupons if you would
						like to create new one.
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Coupon Details</CardTitle>
					<CardDescription>
						Create new coupon for your customers
					</CardDescription>
				</CardHeader>

				<CardContent>
					<NewCouponForm />
				</CardContent>
			</Card>
		</div>
	)
}
