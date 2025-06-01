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
import CopyButton from '@/components/utils/copy-button'
import { Coupon } from '@/db/schema/coupons'
import { deleteCoupon } from '@/features/coupon/actions/delete'
import { updateCoupon } from '@/features/coupon/actions/update'
import { cn } from '@/lib/utils'
import { formatDate, formatId, formatPrice } from '@/utils/format'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const columns: ColumnDef<Coupon>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<Link
				href={`/dashboard/coupons/${row.original.id}`}
				className='hover:font-medium'
			>
				{formatId(row.original.id)}
			</Link>
		)
	},
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => (
			<div className='flex items-center gap-2'>
				{row.original.code}
				<CopyButton text={row.original.code} />
			</div>
		)
	},
	{
		accessorKey: 'value',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Discount'
			/>
		),
		cell: ({ row }) => {
			const coupon = row.original
			const formattedValue =
				coupon.type === 'fixed' ? formatPrice(coupon.value) : coupon.value + '%'

			return formattedValue
		}
	},
	{
		accessorKey: 'maxUses',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Max Uses'
			/>
		),
		cell: ({ row }) => row.original.maxUses ?? 'Unlimited'
	},
	{
		accessorKey: 'usedCount',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Number of uses'
			/>
		)
	},
	{
		accessorKey: 'expiresAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Expiry Date'
			/>
		),
		cell: ({ row }) => {
			const coupon = row.original

			if (!coupon.expiresAt) return 'No expiry'

			return (
				<time dateTime={coupon.expiresAt.toISOString()}>
					{formatDate(coupon.expiresAt, {
						month: 'long',
						day: '2-digit',
						year: 'numeric'
					})}
				</time>
			)
		}
	},
	{
		accessorKey: 'minValueInCents',
		header: 'Minimum Value',
		cell: ({ row }) => {
			const minValueInCents = row.original.minValueInCents

			return minValueInCents ? formatPrice(minValueInCents) : 'No limt'
		}
	},
	{
		accessorKey: 'active',
		header: 'Status',
		cell: ({ row }) => {
			const coupon = row.original
			const isExpired = coupon.expiresAt
				? Date.now() > coupon.expiresAt.getTime()
				: false

			return (
				<Badge variant='outline'>
					<div
						className={cn(
							'size-2 rounded-full mr-1',
							coupon.active && !isExpired ? 'bg-green-500' : 'bg-gray-500'
						)}
					/>
					{isExpired ? 'Expired' : coupon.active ? 'Active' : 'Disabled'}
				</Badge>
			)
		}
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
			const order = row.original

			return (
				<time dateTime={order.createdAt?.toISOString()}>
					{formatDate(order.createdAt!, {
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
			const coupon = row.original
			const pathname = usePathname()
			const [open, setOpen] = useState(false)
			const [active, setActive] = useState(coupon.active)
			const mutation = useMutation({
				mutationKey: ['coupon:delete', coupon.id],
				mutationFn: () => deleteCoupon(coupon.id, { path: pathname }),
				onSettled(data) {
					if (data?.success) {
						toast.success('Coupon deleted successfully')
						setOpen(false)
					}
				}
			})

			const handleActivation = () => {
				const activate = async () => {
					const response = await updateCoupon(
						coupon.id,
						{ active: !active },
						{ path: pathname }
					)

					if (!response.success) {
						throw new Error(
							response.message ??
								`Failed to ${active ? 'disable' : 'activate'} coupon`
						)
					}

					setActive(!active)

					return response
				}

				toast.promise(activate(), {
					loading: active ? 'Disabling coupon...' : 'Activating coupon...',
					success: active ? 'Coupon disabled' : 'Coupon activated',
					error: error => error.message ?? 'Something went wrong'
				})
			}

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
								<MoreHorizontalIcon className='size-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>

							<DropdownMenuItem>
								<Link href={`/dashboard/coupons/${coupon.id}`}>
									View details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<button onClick={handleActivation}>
									{active ? 'Disable coupon' : 'Activate coupon'}
								</button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={`/dashboard/coupons/edit/${coupon.id}`}>
									Edit coupon
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<DialogTrigger>Delete coupon</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove coupon{' '}
							<strong>{coupon.code}</strong> from database. This cannot be
							undone. Proceed with caution.
						</DialogDescription>

						{mutation.data && !mutation.data.success && (
							<ErrorMessage message='Something went wrong' />
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
