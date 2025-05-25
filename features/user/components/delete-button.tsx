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
import { User } from '@/db/schema/users'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteUser } from '../actions/delete'

export default function DeleteUserButton({ userId }: { userId: User['id'] }) {
	const router = useRouter()
	const mutation = useMutation({
		mutationKey: ['user:delete', userId],
		mutationFn: () => deleteUser(userId),
		onSettled(data) {
			if (data?.success) {
				toast.success('User deleted successfully')
				router.replace('/dashboard/users')
			}
		}
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className='bg-transparent border-2 border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 size-10 rounded-lg'
				>
					<Trash2Icon className='size-full' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						You are about to permamently delete this user and all data related
						to them. This cannot be undone. Proceed with caution.
					</DialogDescription>
				</DialogHeader>

				{mutation.data && !mutation.data.success && (
					<ErrorMessage
						message={mutation.data?.message ?? 'Something went wrong'}
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
