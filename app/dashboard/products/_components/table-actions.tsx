'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { deleteProduct } from '@/features/product/actions'
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function TableActions({ productId }: { productId: string }) {
	const form = useForm()
	const { isSubmitting } = form.formState
	const [isOpen, setIsOpen] = useState(false)

	const onSubmit = async () => {
		const response = await deleteProduct(productId)

		if (!response.success) {
			toast.error('Something went wrong.', { description: response.message })
			return
		}

		toast.success(response.message)
		setIsOpen(false)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='size-8 p-0'
					>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontalIcon className='size-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem>
						<Link href={`/dashboard/products/edit/${productId}`}>
							Edit product
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<DialogTrigger>Delete product</DialogTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<DialogHeader>Are you sure?</DialogHeader>
				<DialogDescription>
					You are about to permamently delete this product. Proceed with
					caution.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant='secondary'
							size='sm'
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</DialogClose>

					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Button
							variant='destructive'
							size='sm'
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2Icon className='animate-spin size-4 mr-2' />
							)}
							{isSubmitting ? 'Deleting' : 'Delete'}
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
