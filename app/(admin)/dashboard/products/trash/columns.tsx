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
import Avatar from '@/components/utils/avatar'
import {
	deleteProduct,
	restoreProduct
} from '@/features/product/actions/delete'
import { ProductsReturn } from '@/features/product/actions/read'
import { formatDate, getTimeDistanceFromNow } from '@/utils/format'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, RefreshCw, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export const columns: ColumnDef<ProductsReturn>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => '#' + String(row.original.id).padStart(5, '0')
	},
	{
		accessorKey: 'images',
		header: 'Image',
		cell: ({ row }) => {
			const image = row.original.images[0]

			return (
				<Image
					src={image.url}
					alt={image.url}
					width={64}
					height={64}
					className='size-16 rounded-sm object-contain'
				/>
			)
		}
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
		accessorKey: 'user',
		header: 'Uploaded By',
		cell: ({ row }) => {
			const user = row.original.user

			return (
				<div className='flex items-center gap-4'>
					<Avatar
						src={user.image!}
						alt={user.name}
						width={40}
						height={40}
						className='size-10'
					/>
					<p>{user.name}</p>
				</div>
			)
		}
	},
	{
		accessorKey: 'deletedAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Deleted At'
			/>
		),
		cell: ({ row }) => {
			const product = row.original

			return (
				<time
					dateTime={product.deletedAt?.toISOString()}
					suppressHydrationWarning
				>
					{formatDate(product.deletedAt!)} (
					{getTimeDistanceFromNow(product.deletedAt!)})
				</time>
			)
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const product = row.original
			const deleteMutation = useMutation({
				mutationKey: ['delete:products', product.id],
				mutationFn: (productId: number) => deleteProduct(productId),
				onSettled(data) {
					if (data?.success) {
						toast.success('Deleted successfully')
					}
				}
			})
			const restoreMutation = useMutation({
				mutationKey: ['restore:product', product.id],
				mutationFn: (productId: number) => restoreProduct(productId),
				onSettled(data) {
					if (data?.success) {
						toast.success('Restored successfully')
					}
				}
			})

			return (
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => restoreMutation.mutate(product.id)}
						disabled={restoreMutation.isPending}
					>
						{restoreMutation.isPending ? (
							<Loader2Icon className='animate-spin' />
						) : (
							<RefreshCw />
						)}
						{restoreMutation.isPending ? 'Restoring' : 'Restore'}
					</Button>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								size='sm'
								variant='destructive'
								disabled={restoreMutation.isPending}
							>
								<Trash2Icon /> Delete
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>
								You are about to permamently remove product{' '}
								<strong>{product.name}</strong> from database. This cannot be
								undone. Proceed with caution.
							</DialogDescription>

							{deleteMutation.data && !deleteMutation.data.success && (
								<ErrorMessage message={deleteMutation.data.message} />
							)}

							<DialogFooter>
								<DialogClose asChild>
									<Button
										variant='secondary'
										disabled={deleteMutation.isPending}
									>
										Cancel
									</Button>
								</DialogClose>
								<Button
									variant='destructive'
									onClick={() => deleteMutation.mutate(product.id)}
									disabled={deleteMutation.isPending}
								>
									{deleteMutation.isPending && (
										<Loader2Icon className='animate-spin' />
									)}
									{deleteMutation.isPending ? 'Deleting' : 'Delete permamently'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			)
		}
	}
]
