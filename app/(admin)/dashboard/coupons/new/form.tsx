'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createCoupon } from '@/features/coupon/actions/create'
import { NewCouponSchema, newCouponSchema } from '@/features/coupon/zod'
import { cn } from '@/lib/utils'
import { dateFormatter } from '@/utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import {
	CalendarIcon,
	DollarSignIcon,
	Loader2Icon,
	PercentIcon
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function NewCouponForm() {
	const form = useForm<NewCouponSchema>({
		defaultValues: {
			type: 'percentage'
		},
		resolver: zodResolver(newCouponSchema)
	})

	const onSubmit = async (data: NewCouponSchema) => {
		const response = await createCoupon(data, {
			path: '/dashboard/coupons'
		})

		if (response.success) {
			toast.success('Coupon created successfully!')
			form.reset()
		} else {
			form.setError('root', {
				message: response.message ?? 'Something went wrong'
			})
		}
	}

	const { isSubmitting, errors } = form.formState

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{errors.root && <ErrorMessage message={errors.root.message!} />}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='code'
						render={({ field }) => (
							<FormItem className='col-span-full'>
								<FormLabel>Coupon Code</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										placeholder='SUMMER25'
										value={field.value?.toUpperCase() ?? ''}
										onChange={e => field.onChange(e.target.value.toUpperCase())}
									/>
								</FormControl>
								<FormDescription>Enter coupon code</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormItem>
						<FormLabel>Discount</FormLabel>
						<div className='flex'>
							{/* Type selector */}
							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<Select
										disabled={isSubmitting}
										onValueChange={newValue => {
											const currentValue = Number(form.getValues('value') ?? 0)
											if (newValue === 'percentage' && currentValue > 100) {
												form.setValue('value', 100)
											}
											field.onChange(newValue)
										}}
										value={field.value ?? 'percentage'}
									>
										<SelectTrigger className='w-14 rounded-e-none border-r-0'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='percentage'>
												<PercentIcon className='size-4' />
											</SelectItem>
											<SelectItem value='fixed'>
												<DollarSignIcon className='size-4' />
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>

							{/* Discount value input */}
							<FormField
								control={form.control}
								name='value'
								render={({ field }) => (
									<div className='flex flex-col flex-1'>
										<Input
											disabled={isSubmitting}
											className='rounded-s-none'
											type='number'
											value={field.value ?? ''}
											onChange={e => {
												let val = e.target.value
												if (form.getValues('type') === 'percentage') {
													val = Math.min(Number(val), 100).toString()
												}
												field.onChange(val === '' ? undefined : Number(val))
											}}
										/>
										<FormMessage />
									</div>
								)}
							/>
						</div>

						<FormDescription>
							Enter discount{' '}
							{form.watch('type') === 'percentage'
								? 'percentage'
								: 'in US dollars'}
						</FormDescription>
					</FormItem>

					<FormField
						control={form.control}
						name='minValueInCents'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum Order Value (optional)</FormLabel>
								<FormControl>
									<div className='relative'>
										<span className='absolute left-3 top-1/2 -translate-y-1/2'>
											$
										</span>
										<Input
											disabled={isSubmitting}
											type='number'
											step={0.01}
											className='pl-7'
											value={field.value ?? ''}
											onChange={e =>
												field.onChange(
													e.target.value === ''
														? undefined
														: e.target.valueAsNumber
												)
											}
										/>
									</div>
								</FormControl>
								<FormDescription>
									Minimum order value required to use the coupon
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='maxUses'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Max Uses (optional)</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										type='number'
										value={field.value ?? ''}
										onChange={e =>
											field.onChange(
												e.target.value === ''
													? undefined
													: Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormDescription>
									Limit this coupon to certain number of uses
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='expiresAt'
						render={({ field }) => (
							<FormItem className='flex flex-col mt-2.5'>
								<FormLabel>Expiration date (optional)</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant='outline'
												className={cn(
													'pl-3 text-left font-normal rounded-sm',
													!field.value && 'text-muted-foreground'
												)}
												disabled={isSubmitting}
											>
												{field.value ? (
													dateFormatter.format(field.value)
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='single'
											selected={field.value ?? undefined}
											onSelect={field.onChange}
											disabled={date => date < new Date()}
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Select when this coupon should expire
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem className='col-span-full'>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										disabled={isSubmitting}
										value={field.value ?? ''}
										onChange={e =>
											field.onChange(
												e.target.value === '' ? undefined : e.target.value
											)
										}
									/>
								</FormControl>
								<FormDescription>
									This won&apos;t be visible to customers. It&apos;s only for
									admins to understand the purpose or conditions of the coupon.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type='submit'
					disabled={isSubmitting}
					className='mt-4 ml-auto flex items-center gap-2'
				>
					{isSubmitting ? 'Creating' : 'Create'}
					{isSubmitting && <Loader2Icon className='animate-spin' />}
				</Button>
			</form>
		</Form>
	)
}
