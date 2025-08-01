'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
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
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Avatar from '@/components/utils/avatar'
import { User } from '@/db/schema/users'
import { deleteUser } from '@/features/user/actions/delete'
import { timeFormatter } from '@/utils/format'
import { getRoleBadgeVariant } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<Omit<User, 'hashedPassword'>>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			return (
				<Link href={`/dashboard/users/${row.original.id}`}>
					<Avatar
						src={row.original.image!}
						alt={row.original.name}
						width={40}
						height={40}
						className='size-10'
					/>
				</Link>
			)
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Role'
			/>
		),
		cell: ({ row }) => (
			<Badge
				className='capitalize'
				variant={getRoleBadgeVariant(row.original.role!)}
			>
				{row.original.role}
			</Badge>
		)
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Created At'
			/>
		),
		cell: ({ row }) => (
			<time dateTime={row.original.createdAt.toISOString()}>
				{timeFormatter.format(row.original.createdAt)}
			</time>
		)
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const user = row.original
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['delete:users', user.id],
				mutationFn: () => deleteUser(user.id),
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
								<Link href={`/dashboard/users/${user.id}`}>View user</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<DialogTrigger>Delete user</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove <strong>{user.name}</strong>
							&apos;s data. This cannot be undone. Proceed with caution.
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
								variant='destructive'
								disabled={mutation.isPending}
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
