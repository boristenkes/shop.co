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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { type Color } from '@/db/schema/colors.schema'
import { deleteColor } from '@/features/color/actions'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<Color>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'hexCode',
		header: 'Hex Code',
		cell: ({ row }) => row.original.hexCode.toUpperCase()
	},
	{
		accessorKey: 'preview',
		header: 'Preview',
		cell: ({ row }) => (
			<div
				style={{ backgroundColor: row.original.hexCode }}
				className='size-8 rounded-sm'
			/>
		)
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const color = row.original
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['admin:colors', color.id],
				mutationFn: (colorId: number) => deleteColor(colorId),
				onSuccess: () => {
					toast.success('Deleted successfully')
					setOpen(false)
				}
			})

			return (
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='size-8 rounded-sm'
							>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='size-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>

							<DropdownMenuItem>
								<DialogTrigger>Edit category</DialogTrigger>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<DialogTrigger>Delete category</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove color{' '}
							<strong>{color.name}</strong> from database. This cannot be
							undone. Proceed with caution.
						</DialogDescription>

						{mutation.isError && (
							<ErrorMessage message={mutation.error.message} />
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
								onClick={() => mutation.mutate(color.id)}
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
	}
]
