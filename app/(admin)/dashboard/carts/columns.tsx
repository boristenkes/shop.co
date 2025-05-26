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
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import Avatar from '@/components/utils/avatar'
import { deleteCart } from '@/features/cart/actions/delete'
import { GetAllCartsCart } from '@/features/cart/actions/read'
import { formatInt, getTimeDistanceFromNow } from '@/utils/format'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<GetAllCartsCart>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<Link
				href={`/dashboard/carts/${row.original.id}`}
				className='hover:font-medium'
			>
				{'#' + String(row.original.id).padStart(5, '0')}
			</Link>
		)
	},
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => {
			const user = row.original.user

			return (
				<HoverCard
					openDelay={100}
					closeDelay={100}
				>
					<HoverCardTrigger asChild>
						<Link href={`/dashboard/users/${user.id}`}>
							<Avatar
								src={user.image!}
								alt={user.name}
								width={40}
								height={40}
								className='size-10'
							/>
						</Link>
					</HoverCardTrigger>
					<HoverCardContent>
						<div className='flex gap-2'>
							<Link href={`/dashboard/users/${user.id}`}>
								<Avatar
									src={user.image!}
									alt={user.name}
									width={40}
									height={40}
									className='size-10'
								/>
							</Link>
							<div>
								<h4 className='font-semibold'>
									<Link href={`/dashboard/users/${user.id}`}>{user.name}</Link>
								</h4>
								<p className='text-sm text-gray-600'>{user.email}</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			)
		}
	},
	{
		accessorKey: 'itemCount',
		header: 'Items',
		cell: ({ row }) => formatInt(row.original.itemCount)
	},
	{
		accessorKey: 'lastUpdatedAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Last Updated'
			/>
		),
		cell: ({ row }) => {
			const date = row.original.updatedAt!

			return (
				<time dateTime={date.toISOString()}>
					{getTimeDistanceFromNow(date)}
				</time>
			)
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const cartId = row.original.id
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['cart:delete', cartId],
				mutationFn: () => deleteCart(cartId),
				onSettled(response) {
					if (response?.success) {
						toast.success('Cart deleted successfully')
						setOpen(false)
					}
				}
			})

			return (
				<div className='flex items-center gap-2'>
					<Button
						asChild
						variant='outline'
						size='sm'
						className='text-sm'
					>
						<Link href={`/dashboard/carts/${row.original.id}`}>View cart</Link>
					</Button>

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
								You are about to permamently remove this cart and all its items
								from database. This cannot be undone. Proceed with caution.
							</DialogDescription>

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
										Cancel
									</Button>
								</DialogClose>

								<Button
									onClick={() => mutation.mutate()}
									disabled={mutation.isPending}
									variant='destructive'
								>
									{mutation.isPending && (
										<Loader2Icon className='animate-spin' />
									)}
									{mutation.isPending ? 'Deleting' : 'Delete'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			)
		}
	}
]
