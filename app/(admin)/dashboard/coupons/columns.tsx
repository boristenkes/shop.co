'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyButton from '@/components/utils/copy-button'
import { Coupon } from '@/db/schema/coupons'
import { cn } from '@/lib/utils'
import { formatDate, formatId, formatPrice } from '@/utils/format'
import { type ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

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
		cell: ({ row }) => (
			<Button
				asChild
				variant='outline'
				size='sm'
				className='text-sm'
			>
				<Link href={`/dashboard/coupons/${row.original.id}`}>View coupon</Link>
			</Button>
		)
	}
]
