'use client'

import { Badge } from '@/components/ui/badge'
import { formatDate, formatPrice } from '@/lib/utils'
import {
	Category,
	Product,
	Image as ProductImage,
	ProductSize
} from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import TableActions from './_components/table-actions'

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'images',
		header: 'Image(s)',
		cell: info => {
			const imageUrls = info.getValue() as ProductImage[]
			const firstImageUrl = imageUrls[0].url

			return (
				<Image
					src={firstImageUrl}
					alt=''
					width={56}
					height={56}
					className='size-14 rounded-sm object-contain'
				/>
			)
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: info => {
			const desc = info.getValue() as string

			return (
				<div
					title={desc}
					className='inline-block max-w-44 overflow-hidden whitespace-nowrap text-ellipsis'
				>
					{desc}
				</div>
			)
		}
	},
	{
		accessorKey: 'priceInCents',
		header: 'Price',
		cell: info => {
			const priceInCents = info.getValue() as number

			const formatted = formatPrice(priceInCents / 100)

			return formatted
		}
	},
	{
		accessorKey: 'stock',
		header: 'In Stock',
		cell: info => <div className='text-center'>{info.getValue() as string}</div>
	},
	{
		accessorKey: 'categories',
		header: 'Categories',
		cell: info => {
			const categories = info.getValue() as Category[]

			if (!categories.length) return 'No categories'

			return (
				<div className='flex items-center flex-wrap gap-1'>
					{categories.map(category => (
						<Badge
							key={category.id}
							variant='outline'
						>
							{category.name}
						</Badge>
					))}
				</div>
			)
		}
	},
	{
		accessorKey: 'sizes',
		header: 'Sizes',
		cell: info => {
			const sizes = info.getValue() as ProductSize[]

			if (!sizes.length) return 'No sizes'

			return (
				<div className='flex items-center flex-wrap gap-1'>
					{sizes.map(size => (
						<Badge
							key={size}
							variant='outline'
						>
							{size}
						</Badge>
					))}
				</div>
			)
		}
	},
	{
		accessorKey: 'featured',
		header: 'Featured',
		cell: info => {
			const featured = info.getValue() as boolean

			return (
				<div className='mx-auto w-fit'>
					{featured ? <CheckIcon size={16} /> : <XIcon size={16} />}
				</div>
			)
		}
	},
	{
		accessorKey: 'archived',
		header: 'Archived',
		cell: info => {
			const archived = info.getValue() as boolean

			return (
				<div className='mx-auto w-fit'>
					{archived ? <CheckIcon size={16} /> : <XIcon size={16} />}
				</div>
			)
		}
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: info => {
			const createdAt = info.getValue() as Date

			const formatted = formatDate(createdAt)

			return formatted
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const product = row.original

			return <TableActions productId={product.id} />
		}
	}
]
