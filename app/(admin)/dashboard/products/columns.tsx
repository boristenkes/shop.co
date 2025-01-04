'use client'

import { DataTableColumnHeader } from '@/components/data-table/column-header'
import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { ProductsReturn, softDeleteProduct } from '@/features/product/actions'
import { formatDate, formatPrice, getInitials } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { CheckIcon, Loader2Icon, MoreHorizontal, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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
					className='size-16 rounded-sm object-cover'
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
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Uploaded By'
			/>
		),
		cell: ({ row }) => {
			const user = row.original.user

			return (
				<div className='flex items-center gap-4'>
					<Avatar>
						<AvatarImage
							src={user.image!}
							alt={user.name!}
						/>
						<AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
					</Avatar>
					<p>{user.name}</p>
				</div>
			)
		}
	},
	{
		accessorKey: 'priceInCents',
		header: 'Price',
		cell: ({ row }) => formatPrice(row.original.priceInCents)
	},
	{
		accessorKey: 'sizes',
		header: 'Sizes',
		cell: ({ row }) => (
			<div className='flex flex-wrap gap-1'>
				{row.original.sizes?.map(size => (
					<Badge
						key={size}
						variant='outline'
					>
						{size}
					</Badge>
				))}
			</div>
		)
	},
	{
		accessorKey: 'colors',
		header: 'Colors',
		cell: ({ row }) => (
			<div className='flex flex-wrap gap-1'>
				{row.original.productsToColors?.map(({ color }) => (
					<Badge
						key={color.id}
						variant='outline'
						className='border'
						style={{
							backgroundColor: color.hexCode + '33' // '33' = 20% opacity
						}}
					>
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

			return category ? (
				<Badge
					variant='default'
					className='whitespace-nowrap overflow-hidden'
				>
					{category?.name}
				</Badge>
			) : (
				'No category'
			)
		}
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => formatDate(row.original.createdAt!)
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const product = row.original
			const [open, setOpen] = useState(false)
			const mutation = useMutation({
				mutationKey: ['softdelete:products', product.id],
				mutationFn: (productId: number) => softDeleteProduct(productId),
				onSettled(data) {
					if (data?.success) {
						toast.success('Moved to trash')
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
								<Link href={`/dashboard/products/edit/${product.slug}`}>
									Edit product
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<DialogTrigger>Move to trash</DialogTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							You are about to permamently remove product{' '}
							<strong>{product.name}</strong> from database. This cannot be
							undone. Proceed with caution.
						</DialogDescription>

						{mutation.data?.success === false && (
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
								onClick={() => mutation.mutate(product.id)}
								disabled={mutation.isPending}
								variant='destructive'
							>
								{mutation.isPending && <Loader2Icon className='animate-spin' />}
								{mutation.isPending ? 'Moving to trash' : 'Move to trash'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)
		}
	}
]
