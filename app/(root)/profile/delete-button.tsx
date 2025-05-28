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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/db/schema/users'
import { deleteUser } from '@/features/user/actions/delete'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const CONFIRM_MESSAGE = 'Delete account'

export default function DeleteSelfButton({ userId }: { userId: User['id'] }) {
	const router = useRouter()
	const [message, setMessage] = useState('')
	const mutation = useMutation({
		mutationKey: ['user:delete', userId],
		mutationFn: () => deleteUser(userId),
		onSettled(response) {
			if (response?.success) {
				toast.success('Account deleted successfully')
				router.replace('/')
			}
		}
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='destructive'>Delete your account</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						By pressing button below you&apos;re irreversibly deleting all your
						data from our database.
					</DialogDescription>
				</DialogHeader>

				{mutation.data && !mutation.data.success && (
					<ErrorMessage
						message={mutation.data?.message ?? 'Something went wrong'}
					/>
				)}

				<div className='space-y-1'>
					<Label htmlFor='message'>
						Enter <strong>{CONFIRM_MESSAGE}</strong> to confirm
					</Label>
					<Input
						id='message'
						value={message}
						onChange={e => setMessage(e.target.value)}
						disabled={mutation.isPending}
					/>
				</div>

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
						disabled={mutation.isPending || message !== CONFIRM_MESSAGE}
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
