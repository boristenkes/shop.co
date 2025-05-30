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
import { type Color } from '@/db/schema/colors'
import { deleteColor } from '@/features/color/actions/delete'
import { formatId } from '@/utils/format'
import { darkenHex } from '@/utils/helpers'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<Color>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => formatId(row.original.id)
	},
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
				style={{
					backgroundColor: row.original.hexCode,
					borderColor: darkenHex(row.original.hexCode)
				}}
				className='size-8 rounded-sm border-2'
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
							className='rounded-lg text-red-500'
						>
							<TrashIcon />
						</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove color{' '}
							<strong>{color.name}</strong> from database. This cannot be
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
