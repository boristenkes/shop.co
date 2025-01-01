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
import { purgeSoftDeletedProducts } from '@/features/product/actions'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function EmptyTrashButton(props: ButtonProps) {
	const [open, setOpen] = useState(false)
	const mutation = useMutation({
		mutationKey: ['emptytrash'],
		mutationFn: () => purgeSoftDeletedProducts(),
		onSettled(data) {
			if (data?.success) {
				toast.success('Trash emptied successfully')
				setOpen(false)
			}
		}
	})

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant='destructive'
					{...props}
				>
					Empty trash
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This will permamently delete all products from trash and all data
						related to them. This cannot be undone. Proceed with caution.
					</DialogDescription>
				</DialogHeader>

				{mutation.data?.success === false && (
					<ErrorMessage message={mutation.data.message} />
				)}

				<DialogFooter>
					<DialogClose disabled={mutation.isPending}>Cancel</DialogClose>

					<Button
						variant='destructive'
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
					>
						{mutation.isPending && <Loader2Icon className='animate-spin' />}
						{mutation.isPending ? 'Emptying trash' : 'Empty trash'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
