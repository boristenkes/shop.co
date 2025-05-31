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
import { Textarea } from '@/components/ui/textarea'
import { ProductFAQ } from '@/db/schema/product-faqs'
import { Product } from '@/db/schema/products'
import { createProductFAQ } from '@/features/faq/actions/create'
import { deleteProductFAQ } from '@/features/faq/actions/delete'
import { updateProductFAQ } from '@/features/faq/actions/update'
import {
	EditProductFAQSchema,
	editProductFAQSchema,
	newProductFAQSchema,
	NewProductFAQSchema
} from '@/features/faq/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function AddProductFAQButton({
	productId,
	children
}: {
	productId: Product['id']
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const form = useForm<NewProductFAQSchema>({
		defaultValues: {
			question: '',
			answer: ''
		},
		resolver: zodResolver(newProductFAQSchema.omit({ productId: true }))
	})
	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: Omit<NewProductFAQSchema, 'productId'>) => {
		const response = await createProductFAQ(
			{ ...data, productId },
			{ path: pathname }
		)

		if (response.success) {
			toast.success('FAQ created successfully')
			setOpen(false)
			form.reset()
		} else {
			form.setError('root', {
				message: response.message ?? 'Something went wrong'
			})
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Product FAQ</DialogTitle>
					<DialogDescription>
						Populate fields below to create new FAQ
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						{errors.root && <ErrorMessage message={errors.root.message!} />}

						<FormField
							control={form.control}
							name='question'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter question</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='answer'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Answer</FormLabel>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter answer</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={isSubmitting}
							>
								{isSubmitting && <Loader2Icon className='animate-spin' />}
								{isSubmitting ? 'Creating' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export function EditProductFAQButton({
	faq,
	children
}: {
	faq: ProductFAQ
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const form = useForm<EditProductFAQSchema>({
		defaultValues: {
			question: faq.question,
			answer: faq.answer
		},
		resolver: zodResolver(editProductFAQSchema)
	})
	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: EditProductFAQSchema) => {
		const response = await updateProductFAQ(faq.id, data, {
			path: pathname
		})

		if (response.success) {
			toast.success('Product FAQ updated successfully')
			setOpen(false)
		} else {
			form.setError('root', {
				message: response.message ?? 'Something went wrong'
			})
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger
				asChild
				onClick={e => {
					setOpen(false)
				}}
			>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Product FAQ</DialogTitle>
					<DialogDescription>
						Edit FAQ through form below. Click save when you&apos;re done
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						{errors.root && <ErrorMessage message={errors.root.message!} />}

						<FormField
							control={form.control}
							name='question'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter question</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='answer'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Answer</FormLabel>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter answer</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={isSubmitting}
							>
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

export function DeleteProductFAQButton({
	faqId,
	children
}: {
	faqId: ProductFAQ['id']
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const mutation = useMutation({
		mutationKey: ['faq:delete', faqId],
		mutationFn: () => deleteProductFAQ(faqId, { path: pathname }),
		onSettled(response) {
			if (response?.success) {
				toast.success('FAQ deleted successfully')
				setOpen(false)
			}
		}
	})

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						You are about to permamently delete this product FAQ. This cannot be
						undone. Proceed with caution.
					</DialogDescription>
				</DialogHeader>

				{mutation.data && !mutation.data.success && (
					<ErrorMessage
						message={mutation.data.message ?? 'Something went wrong'}
					/>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant='secondary'
							disabled={mutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
						variant='destructive'
					>
						{mutation.isPending && <Loader2Icon className='animate-spin' />}
						{mutation.isPending ? 'Deleting' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
