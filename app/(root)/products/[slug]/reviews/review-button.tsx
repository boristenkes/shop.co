'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
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
import { RatingInput } from '@/components/ui/rating'
import { Textarea } from '@/components/ui/textarea'
import { reviewSchema, ReviewSchema } from '@/features/review/zod'
import useMediaQuery from '@/hooks/use-media-query'
import { delay } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function ReviewButton() {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				<DialogTrigger asChild>
					<Button>Write a Review</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Write a Review</DialogTitle>
						<DialogDescription>
							Rate this product and give it a comment.
						</DialogDescription>
					</DialogHeader>

					<ReviewForm setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer disablePreventScroll>
			<DrawerTrigger asChild>
				<Button>Write a Review</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Write a Review</DrawerTitle>
					<DrawerDescription>
						Rate this product and give it a comment.
					</DrawerDescription>
				</DrawerHeader>

				<div className='px-4 pb-4'>
					<ReviewForm setOpen={setOpen} />
				</div>
			</DrawerContent>
		</Drawer>
	)
}

function ReviewForm({
	setOpen
}: {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const form = useForm<ReviewSchema>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			name: '',
			comment: '',
			rating: 0,
			recommended: false
		}
	})

	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: ReviewSchema) => {
		try {
			await delay(5000)

			console.log(data)

			form.reset()
			setOpen(false)
			toast.success('Review submitted successfully', {
				description:
					'Your review has been submitted and will be visible once it has been approved by an administrator.'
			})
		} catch (error: any) {
			form.setError('root', { message: error.message })
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				{errors.root && <ErrorMessage message={errors.root.message!} />}
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter name to display with review
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='comment'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Comment</FormLabel>
							<FormControl>
								<Textarea
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Write a comment for this product
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='rating'
					render={({ field }) => (
						<FormItem className='flex flex-col items-start'>
							<FormLabel>Rating</FormLabel>
							<FormControl className='w-full'>
								<RatingInput
									readOnly={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>Please provide your rating.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='recommended'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isSubmitting}
								/>
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel>Recommended</FormLabel>
								<FormDescription>
									I would recommend this product to other users.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant='secondary'
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						type='submit'
						disabled={isSubmitting}
						className='flex items-center gap-2'
					>
						{isSubmitting && <Loader2Icon className='animate-spin' />}
						{isSubmitting ? 'Submitting' : 'Submit'}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}
