'use client'

import ErrorMessage from '@/components/error-message'
import { Button, ButtonProps } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Review } from '@/db/schema/reviews'
import { deleteReview } from '@/features/review/actions/delete'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

type DeleteReviewButtonProps = ButtonProps & {
	reviewId: Review['id']
}

export default function DeleteReviewButton({
	reviewId,
	...props
}: DeleteReviewButtonProps) {
	const mutation = useMutation({
		mutationKey: ['review:delete', reviewId],
		mutationFn: () => deleteReview(reviewId),
		onSettled(data) {
			if (data?.success) {
				toast.success('Review deleted successfully')
			}
		}
	})

	return (
		<Dialog>
			<DialogTrigger
				asChild
				{...props}
			/>

			<DialogContent>
				<DialogTitle>Are you sure?</DialogTitle>
				<DialogDescription>
					You are about to permamently delete this review. This cannot be
					undone. Proceed with caution.
				</DialogDescription>

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
