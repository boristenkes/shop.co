'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import Avatar from '@/components/utils/avatar'
import { GetAllOrdersOrder } from '@/features/orders/actions/read'
import OrderStatusBadge from '@/features/orders/components/status-badge'
import { dateFormatter, formatId, formatPrice } from '@/utils/format'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<GetAllOrdersOrder>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<Link
				href={`/dashboard/orders/${row.original.id}`}
				className='hover:font-medium'
			>
				{formatId(row.original.id)}
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
		accessorKey: 'shippingAddress',
		header: 'Shipping Address',
		cell: ({ row }) => {
			const order = row.original

			if (!order.shippingAddress)
				return <p className='italic text-gray-500'>No address</p>

			return (
				<p className='line-clamp-2 text-left overflow-hidden text-ellipsis max-w-96'>
					{order.shippingAddress}
				</p>
			)
		}
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Status'
			/>
		),
		cell: ({ row }) => <OrderStatusBadge status={row.original.status} />
	},
	{
		accessorKey: 'totalPriceInCents',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Total'
			/>
		),
		cell: ({ row }) => formatPrice(row.original.totalPriceInCents)
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Ordered At'
			/>
		),
		cell: ({ row }) => {
			const order = row.original

			return (
				<time dateTime={order.createdAt.toISOString()}>
					{dateFormatter.format(order.createdAt)}
				</time>
			)
		}
	},
	{
		accessorKey: 'receiptUrl',
		header: 'Receipt',
		cell: ({ row }) => {
			const order = row.original

			if (!order.receiptUrl) return <em>No receipt</em>

			return (
				<a
					href={order.receiptUrl}
					className='font-semibold text-slate-700 hover:text-slate-500 flex items-center gap-2'
					target='_blank'
				>
					View Receipt
				</a>
			)
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => (
			<Button
				asChild
				variant='outline'
				size='sm'
				className='text-sm'
			>
				<Link
					href={`/dashboard/orders/${row.original.id}`}
					// className='font-medium hover:underline'
				>
					View order
				</Link>
			</Button>
		)
	}
]
