'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User } from '@/db/schema/users.schema'
import { formatDate, getInitials, getRoleBadgeVariant } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, CopyIcon, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'image',
		header: 'Image',
		cell: ({ row }) => {
			return (
				<Avatar>
					<AvatarImage
						src={row.original.image!}
						alt={row.original.name!}
						width={40}
						height={40}
						className='rounded-sm'
					/>
					<AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
				</Avatar>
			)
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			const [copied, setCopied] = useState(false)

			const copy = async () => {
				await navigator.clipboard.writeText(row.original.email ?? '')
				setCopied(true)

				setTimeout(() => setCopied(false), 2000)
			}

			return (
				<div className='flex items-center'>
					{row.original.email}
					<Button
						onClick={copy}
						size='icon'
						variant='ghost'
						aria-label={copied ? 'Copied' : 'Copy' + ' user email'}
					>
						{copied ? <CheckIcon /> : <CopyIcon />}
					</Button>
				</div>
			)
		}
	},
	{
		accessorKey: 'role',
		header: 'Role',
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
		header: 'Created At',
		cell: ({ row }) => formatDate(row.original.createdAt ?? '')
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const payment = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='h-8 w-8 p-0 rounded-sm'
						>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>Copy user email</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
