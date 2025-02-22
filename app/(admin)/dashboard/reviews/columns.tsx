'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
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
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import Avatar from '@/components/utils/avatar'
import {
	approveReview,
	deleteReview,
	GetReviewsReturnReview
} from '@/features/review/actions'
import { formatDate } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { CheckIcon, Loader2Icon, MoreHorizontal, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<GetReviewsReturnReview>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => '#' + String(row.original.id).padStart(5, '0')
	},
	{
		accessorKey: 'product',
		header: 'Product',
		cell: ({ row }) => {
			const product = row.original.product

			return (
				<Link
					href={`/products/${product.slug}/${product.id}/reviews`}
					className='hover:underline underline-offset-4'
				>
					<Image
						src={product.images[0].url}
						alt={product.name}
						width={64}
						height={64}
						className='size-16 rounded-lg object-contain bg-stone-100 p-px'
					/>
				</Link>
			)
		}
	},
	{
		accessorKey: 'user',
		header: 'User',
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
		accessorKey: 'comment',
		header: 'Comment',
		cell: ({ row }) => {
			const review = row.original

			if (!review.comment)
				return <p className='italic text-gray-500'>No comment</p>

			return (
				<Tooltip>
					<TooltipTrigger>
						<p className='line-clamp-2 text-left overflow-hidden text-ellipsis max-w-96'>
							<q>{review.comment}</q>
						</p>
					</TooltipTrigger>
					<TooltipContent
						side='bottom'
						className='max-w-96'
					>
						<q>{review.comment}</q>
					</TooltipContent>
				</Tooltip>
			)
		}
	},
	{
		accessorKey: 'approved',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Approved'
			/>
		),
		cell: ({ row }) => (
			<div className='w-fit'>
				{row.original.approved ? (
					<CheckIcon className='size-4' />
				) : (
					<XIcon className='size-4' />
				)}
			</div>
		)
	},
	{
		accessorKey: 'rating',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Rating'
			/>
		),
		cell: ({ row }) => <Rating rating={row.original.rating} />
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Created At'
			/>
		),
		cell: ({ row }) => {
			const review = row.original

			return (
				<time dateTime={review.createdAt?.toISOString()}>
					{formatDate(review.createdAt!, {
						month: 'long',
						day: '2-digit',
						year: 'numeric'
					})}
				</time>
			)
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const review = row.original
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['review:approve', review.id],
				mutationFn: (action: 'approve' | 'delete') =>
					action === 'approve'
						? approveReview(review.id)
						: deleteReview(review.id),
				onSettled(data, _, action) {
					if (data?.success) {
						toast.success(action === 'approve' ? 'Approved' : 'Deleted')
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

							{!review.approved && (
								<DropdownMenuItem>
									<button onClick={() => mutation.mutate('approve')}>
										Approve
									</button>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem>
								<DialogTrigger>Delete</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove review from database. This
							cannot be undone. Proceed with caution.
						</DialogDescription>

						{mutation.data && !mutation.data.success && (
							<ErrorMessage message={mutation.data?.message!} />
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
								onClick={() => mutation.mutate('delete')}
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
