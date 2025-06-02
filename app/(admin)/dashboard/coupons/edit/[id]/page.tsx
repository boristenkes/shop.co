import ErrorMessage from '@/components/error-message'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { getCouponById } from '@/features/coupon/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import EditCouponForm from './form'

export default async function EditCouponPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['update']))
		notFound()

	const couponId = (await props.params).id

	const response = await getCouponById(Number(couponId))

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
				<h1 className='text-3xl font-bold'>Edit Coupon</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Coupon Details</CardTitle>
					<CardDescription>
						Edit coupon through fields below. Click save when you&apos;re done
					</CardDescription>
				</CardHeader>

				<CardContent>
					{response.success ? (
						<EditCouponForm coupon={response.coupon} />
					) : (
						<ErrorMessage
							message={response.message ?? 'Something went wrong'}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
