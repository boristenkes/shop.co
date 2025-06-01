import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BackButton } from '@/components/utils/back-button'
import { ArrowLeft } from 'lucide-react'
import NewCouponForm from './form'

export default function NewCouponPage() {
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
