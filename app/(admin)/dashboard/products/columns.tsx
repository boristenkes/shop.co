'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import Avatar from '@/components/utils/avatar'
import { softDeleteProduct } from '@/features/product/actions/delete'
import { ProductsReturn } from '@/features/product/actions/read'
import { formatDate, formatId, formatPrice } from '@/utils/format'
import { type ColumnDef } from '@tanstack/react-table'
import { CheckIcon, MoreHorizontal, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

export const columns: ColumnDef<ProductsReturn>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => formatId(row.original.id)
	},
	{
		accessorKey: 'images',
		header: 'Image',
		cell: ({ row }) => {
			const product = row.original
			const image = product.images[0]

			return (
				<Link href={`/dashboard/products/${product.id}`}>
					<Image
						src={image.url}
						alt={image.url}
						width={64}
						height={64}
						className='size-16 rounded-lg object-contain bg-stone-100 p-px'
					/>
				</Link>
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
		),
		cell: ({ row }) => (
			<Link href={`/dashboard/products/${row.original.id}`}>
				{row.original.name}
			</Link>
		)
	},
	{
		accessorKey: 'user',
		header: 'Uploaded By',
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
		accessorKey: 'priceInCents',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Price'
			/>
		),
		cell: ({ row }) => formatPrice(row.original.priceInCents)
	},
	{
		accessorKey: 'sizes',
		header: 'Sizes',
		cell: ({ row }) => row.original.sizes.join(', ')
	},
	{
		accessorKey: 'colors',
		header: 'Colors',
		cell: ({ row }) => (
			<div className='flex flex-wrap gap-1'>
				{row.original.productsToColors.map(({ color }) => (
					<Badge
						key={color.id}
						variant='outline'
						className='border'
						style={{
							backgroundColor: color.hexCode + '33' // '33' = 20% opacity
						}}
					>
						<div
							className='size-3 rounded-sm mr-1'
							style={{ backgroundColor: color.hexCode }}
						/>{' '}
						{color.name}
					</Badge>
				))}
			</div>
		)
	},
	{
		accessorKey: 'discount',
		header: 'Discount',
		cell: ({ row }) => row.original.discount + '%'
	},
	{
		accessorKey: 'stock',
		header: 'In Stock'
	},
	{
		accessorKey: 'featured',
		header: 'Featured',
		cell: ({ row }) =>
			row.original.featured ? (
				<CheckIcon className='size-4' />
			) : (
				<XIcon className='size-4' />
			)
	},
	{
		accessorKey: 'archived',
		header: 'Archived',
		cell: ({ row }) =>
			row.original.archived ? (
				<CheckIcon className='size-4' />
			) : (
				<XIcon className='size-4' />
			)
	},
	{
		accessorKey: 'category',
		header: 'Category',
		cell: ({ row }) => {
			const category = row.original.category

			if (!category) return 'No category'

			return (
				<Badge
					variant='default'
					className='whitespace-nowrap overflow-hidden'
				>
					{category.name}
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
			const product = row.original

			return (
				<time dateTime={product.createdAt.toISOString()}>
					{formatDate(product.createdAt!, {
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
			const product = row.original

			const handleSoftDelete = () => {
				const deletePromise = async () => {
					const res = await softDeleteProduct(product.id)
					if (!res.success)
						throw new Error(res.message ?? 'Something went wrong')
					return res
				}

				toast.promise(deletePromise(), {
					loading: 'Moving to trash...',
					success: 'Product moved to trash',
					error: error => error.message
				})
			}

			return (
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
							<Link href={`/dashboard/products/${product.id}`}>
								View details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/products/${product.slug}/${product.id}`}>
								View in store
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href={`/dashboard/products/edit/${product.id}`}>
								Edit product
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<button onClick={handleSoftDelete}>Move to trash</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
