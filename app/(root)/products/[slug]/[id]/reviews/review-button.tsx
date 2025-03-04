'use client'

import ErrorMessage from '@/components/error-message'
import { Button, ButtonProps } from '@/components/ui/button'
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
import { RatingInput } from '@/components/ui/rating'
import { Textarea } from '@/components/ui/textarea'
import { createReview } from '@/features/review/actions/create'
import { reviewSchema, ReviewSchema } from '@/features/review/zod'
import useMediaQuery from '@/hooks/use-media-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function ReviewButton(props: ButtonProps) {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				<DialogTrigger asChild>
					<Button {...props}>Write a Review</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Write a Review</DialogTitle>
						<DialogDescription>
							Your review won&apos;t be visible unless you include a comment,
							but your rating will still contribute to the average. If you do
							leave a comment, your review will need to be approved by an
							administrator before it appears on the page.
						</DialogDescription>
					</DialogHeader>

					<ReviewForm setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer
			open={open}
			onOpenChange={setOpen}
		>
			<DrawerTrigger asChild>
				<Button {...props}>Write a Review</Button>
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
	const session = useSession()
	const params = useParams()
	const form = useForm<ReviewSchema>({
		resolver: zodResolver(reviewSchema),
		defaultValues: { rating: 0 }
	})

	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: ReviewSchema) => {
		try {
			if (session.status !== 'authenticated') {
				toast.error('You must be signed in to write a review.')
				return
			}

			const response = await createReview({
				...data,
				productId: Number(params.id)
			})

			if (!response.success) throw new Error(response.message)

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
							<FormDescription>Provide your rating.</FormDescription>
							<FormMessage />
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
