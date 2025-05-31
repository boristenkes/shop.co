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
import { Order } from '@/db/schema/orders'
import { updateOrder } from '@/features/orders/actions/update'
import { formatId } from '@/utils/format'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export default function CancelOrderButton({
	orderId
}: {
	orderId: Order['id']
}) {
	const pathname = usePathname()
	const mutation = useMutation({
		mutationKey: ['order:cancel', orderId],
		mutationFn: () =>
			updateOrder(orderId, { status: 'canceled' }, { path: pathname }),
		onSettled(response) {
			if (response?.success) {
				toast.success('Order canceled successfully')
			}
		}
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					size='sm'
				>
					Cancel
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						You are about to cancel order {formatId(orderId)}.
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
							Don&apos;t cancel
						</Button>
					</DialogClose>

					<Button
						onClick={() => mutation.mutate()}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? 'Canceling' : 'Cancel Order'}
						{mutation.isPending && <Loader2Icon className='animate-spin' />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
