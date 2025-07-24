'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Button } from '@/components/ui/button'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import Avatar from '@/components/utils/avatar'
import { GetAllCartsCart } from '@/features/cart/actions/read'
import DeleteCartButton from '@/features/cart/components/delete-cart-button'
import { formatId, getTimeDistanceFromNow, intFormatter } from '@/utils/format'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<GetAllCartsCart>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => (
			<Link
				href={`/dashboard/carts/${row.original.id}`}
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
		accessorKey: 'itemCount',
		header: 'Items',
		cell: ({ row }) => intFormatter.format(row.original.itemCount)
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
			const date = row.original.updatedAt

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
		cell: ({ row }) => (
			<div className='flex items-center gap-2'>
				<Button
					asChild
					variant='outline'
					size='sm'
					className='text-sm'
				>
					<Link href={`/dashboard/carts/${row.original.id}`}>View cart</Link>
				</Button>

				<DeleteCartButton cartId={row.original.id} />
			</div>
		)
	}
]
