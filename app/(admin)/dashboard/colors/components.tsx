'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
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
import { createColor } from '@/features/color/actions'
import { newColorSchema } from '@/features/color/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function NewColorButton() {
	const form = useForm({
		defaultValues: {
			name: '',
			hexCode: ''
		},
		resolver: zodResolver(newColorSchema)
	})
	const { errors, isSubmitting } = form.formState
	const [open, setOpen] = useState(false)

	const onSubmit = async (data: z.infer<typeof newColorSchema>) => {
		const response = await createColor(data)

		if (response.success) {
			toast.success('Color created successfully')
			setOpen(false)
			form.reset()
		} else {
			form.setError('root', { message: response.message })
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button>Add Category</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new category</DialogTitle>
					<DialogDescription>
						Enter category name below. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>

				{errors.root && <ErrorMessage message={errors.root.message!} />}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-2'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder='Red'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter color name here.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='hexCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											placeholder='#FF0000'
											type='color'
											className='h-16'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Pick your color</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className='pt-4'>
							<DialogClose asChild>
								<Button
									variant='secondary'
									disabled={isSubmitting}
									type='button'
								>
									Cancel
								</Button>
							</DialogClose>

							<Button disabled={isSubmitting}>
								{isSubmitting && <Loader2Icon className='animate-spin' />}
								{isSubmitting ? 'Saving' : 'Save'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
