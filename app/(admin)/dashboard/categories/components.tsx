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
import { createCategory } from '@/features/category/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const newCategorySchema = z.object({
	name: z.string().trim().min(1, 'Name is required')
})

export default function NewCategoryButton() {
	const form = useForm({
		defaultValues: { name: '' },
		resolver: zodResolver(newCategorySchema)
	})
	const { errors, isSubmitting } = form.formState
	const [open, setOpen] = useState(false)

	const onSubmit = async (data: z.infer<typeof newCategorySchema>) => {
		const response = await createCategory(data.name)

		if (response.success) {
			toast.success('Category created successfully')
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
											placeholder='Winter clothes'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter category name here.</FormDescription>
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
