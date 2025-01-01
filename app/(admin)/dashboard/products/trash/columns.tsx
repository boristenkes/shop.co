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
	deleteProduct,
	ProductsReturn,
	restoreProduct
} from '@/features/product/actions'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, RefreshCw, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { columns as adminProductsColumns } from '../columns'

const adminProductsColumnsWithoutActions = adminProductsColumns.filter(
	// @ts-expect-error TODO
	col => col.accessorKey !== 'actions'
)

export const columns: ColumnDef<ProductsReturn>[] = [
	...adminProductsColumnsWithoutActions,
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

							{deleteMutation.data?.success === false && (
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
