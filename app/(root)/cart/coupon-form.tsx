'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { useCookie } from '@/context/cookie'
import { validateCoupon } from '@/features/coupon/actions/read'
import { ClientCouponSchema, newCouponSchema } from '@/features/coupon/zod'
import { SetState } from '@/lib/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, TagIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export type ApplyCouponFormProps = React.ComponentProps<'input'> & {
	totalInCents: number
	setCoupon: SetState<ClientCouponSchema | null>
}

const couponCodeSchema = newCouponSchema.pick({
	code: true
})

export default function ApplyCouponForm({
	disabled,
	totalInCents,
	setCoupon,
	...props
}: ApplyCouponFormProps) {
	const form = useForm<z.infer<typeof couponCodeSchema>>({
		resolver: zodResolver(couponCodeSchema)
	})
	const { isSubmitting, errors } = form.formState
	const couponCookie = useCookie()

	const onSubmit = async (data: z.infer<typeof couponCodeSchema>) => {
		if (couponCookie.value === data.code) return form.reset() // Coupon already applied

		const response = await validateCoupon(data.code, totalInCents)

		if (response.success) {
			couponCookie.set(response.coupon.code, {
				expires: 1 // 1 day
			})
			setCoupon(response.coupon)
			toast.success('Coupon applied successfully')
			form.reset()
		} else {
			form.setError('root', {
				message: response.message ?? 'Something went wrong'
			})
			setCoupon(null)
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			{errors.root && (
				<ErrorMessage
					message={errors.root.message ?? 'Something went wrong'}
					className='mb-6'
				/>
			)}
			<div className='flex items-center gap-2'>
				<label
					htmlFor='coupon-code'
					className='sr-only'
				>
					Coupon code
				</label>
				<div className='relative grow'>
					<TagIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400' />
					<input
						{...form.register('code', {
							onChange: e => {
								e.target.value = e.target.value.toUpperCase()
								form.setValue('code', e.target.value, { shouldValidate: true })
							}
						})}
						type='text'
						id='coupon-code'
						placeholder='Enter coupon code'
						aria-label='Coupon code'
						className={cn(
							'w-full py-3 pl-12 rounded-full bg-neutral-100 placeholder-neutral-400',
							{
								'cursor-not-allowed opacity-50': disabled || isSubmitting
							}
						)}
						disabled={disabled || isSubmitting}
						{...props}
					/>
				</div>
				<Button
					type='submit'
					className='px-8 h-11'
					disabled={disabled || isSubmitting}
				>
					{isSubmitting ? 'Please wait' : 'Apply'}
					{isSubmitting && <Loader2Icon className='size-4 animate-spin' />}
				</Button>
			</div>
		</form>
	)
}
