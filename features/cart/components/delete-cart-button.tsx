'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Cart } from '@/db/schema/carts'
import { deleteCart } from '@/features/cart/actions/delete'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function DeleteCartButton({ cartId }: { cartId: Cart['id'] }) {
	const [open, setOpen] = useState(false)
	const mutation = useMutation({
		mutationKey: ['cart:delete', cartId],
		mutationFn: () => deleteCart(cartId),
		onSettled(response) {
			if (response?.success) {
				toast.success('Cart deleted successfully')
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
					size='icon'
					variant='ghost'
					className='rounded-lg text-red-500 hover:text-red-600'
				>
					<TrashIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Are you sure?</DialogTitle>
				<DialogDescription>
					You are about to permamently remove this cart and all its items from
					database. This cannot be undone. Proceed with caution.
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
