'use client'

import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
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
import { createCategory } from '@/features/category/actions'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function NewCategoryButton() {
	const [state, action, pending] = useActionState(createCategory, null)
	const [name, setName] = useState('')
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (state === null) return

		if (state.success) {
			toast.success('Category created successfully')
			setOpen(false)
			setName('')
		}
	}, [state])

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

				{state?.success === false && <ErrorMessage message={state.message} />}

				<form
					action={action}
					className='space-y-2'
				>
					<Label htmlFor='category-name'>Name</Label>
					<Input
						id='category-name'
						name='name'
						disabled={pending}
						value={name}
						onChange={e => setName(e.target.value)}
					/>

					<DialogFooter className='pt-4'>
						<DialogClose asChild>
							<Button
								variant='secondary'
								disabled={pending}
								type='button'
							>
								Cancel
							</Button>
						</DialogClose>

						<SubmitButton
							pendingText='Saving'
							disabled={!name.length || pending}
						>
							Save
						</SubmitButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
