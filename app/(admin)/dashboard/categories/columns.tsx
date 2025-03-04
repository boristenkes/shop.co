'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
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
import { Category } from '@/db/schema/categories'
import { deleteCategory } from '@/features/category/actions/delete'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<Category>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => '#' + String(row.original.id).padStart(5, '0')
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Name'
			/>
		)
	},
	{
		accessorKey: 'productCount',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Product Count'
			/>
		)
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const category = row.original
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['admin:categories', category.id],
				mutationFn: (categoryId: number) => deleteCategory(categoryId),
				onSettled(data) {
					if (data?.success) {
						toast.success('Deleted successfully')
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
							You are about to permamently remove category{' '}
							<strong>{category.name}</strong> from database. This cannot be
							undone. Proceed with caution.
						</DialogDescription>

						{mutation.data && !mutation.data.success && (
							<ErrorMessage message={mutation.data.message} />
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
								onClick={() => mutation.mutate(category.id)}
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
