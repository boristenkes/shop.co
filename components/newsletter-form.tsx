'use client'

import { subcribeToNewsletter } from '@/features/newsletter/actions'
import { integralCf } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, MailIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import SubmitButton from './submit-button'
import { Input } from './ui/input'

const formSchema = z.object({
	email: z.string().email()
})

export default function NewsletterForm({
	className,
	...props
}: ComponentProps<'div'>) {
	const form = useForm({
		defaultValues: { email: '' },
		resolver: zodResolver(formSchema)
	})

	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const { success, message } = await subcribeToNewsletter(data.email)

		toast[success ? 'success' : 'error'](message)

		form.reset()
	}

	return (
		<div
			className={cn(
				'container py-9 px-8 lg:px-16 rounded-3xl bg-neutral-950 flex items-center justify-between flex-wrap mx-auto gap-4',
				className
			)}
			{...props}
		>
			<p
				className={`${integralCf.className} text-3xl lg:text-5xl text-balance font-semibold text-neutral-100 uppercase max-w-2xl`}
			>
				STAY UP TO DATE ABOUT OUR LATEST OFFERS
			</p>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid gap-4'
				noValidate
			>
				<label
					htmlFor='subscriber-email'
					className='sr-only'
				>
					Enter your email address
				</label>
				<div className='relative'>
					<MailIcon className='absolute top-1/2 left-4 -translate-y-1/2 size-5 text-zinc-500 ' />
					<Input
						id='subscriber-email'
						type='email'
						placeholder='Enter your email address'
						className={cn('rounded-full pl-11 h-12 max-w-80 w-full', {
							'border-zinc-200': !errors.email,
							'border-red-500': errors.email
						})}
						disabled={isSubmitting}
						{...form.register('email')}
					/>
				</div>
				<SubmitButton
					type='submit'
					variant='secondary'
					size='lg'
					className='font-semibold max-w-80 w-full'
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Loader2Icon className='animate-spin' />
					) : (
						'Subscribe to Newsletter'
					)}
				</SubmitButton>
			</form>
		</div>
	)
}
