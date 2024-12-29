'use client'

import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
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
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { queryClient } from '@/components/utils/providers'
import {
	deleteUser,
	getUsers,
	type GetUsersReturn
} from '@/features/user/actions'
import { formatDate, getInitials, getRoleBadgeVariant } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
	ArrowLeft,
	ArrowRight,
	Loader2Icon,
	MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface DataTableProps {
	initialPage: number
	initialData: GetUsersReturn
}

export function UsersTable({ initialPage, initialData }: DataTableProps) {
	const [page, setPage] = useState(initialPage)
	const { data, isLoading, isPlaceholderData } = useQuery({
		queryKey: ['admin:users', page],
		queryFn: () => getUsers({ page }),
		initialData,
		placeholderData: keepPreviousData
	})
	const [deleteUserState, deleteUserAction, isDeletePending] = useActionState(
		deleteUser,
		null
	)

	useEffect(() => {
		if (deleteUserState === null) return

		if (deleteUserState.success) {
			toast.success('Deleted successfully')
			queryClient.invalidateQueries({
				queryKey: ['admin:users', page]
			})
		}
	}, [deleteUserState])

	const movePage = (offset: number) => {
		const newPageNum = Math.max(1, page + offset)

		history.replaceState(null, '', `?page=${newPageNum}`)
		setPage(newPageNum)
	}

	return (
		<div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Image</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<Loader2Icon className='animate-spin' />
						) : !data.success ? (
							<ErrorMessage message={data.message} />
						) : data.users.length === 0 ? (
							<TableRow>
								<TableCell className='h-24 text-center'>No results.</TableCell>
							</TableRow>
						) : (
							data.users.map(user => (
								<TableRow key={user.id}>
									<TableCell>{user.id}</TableCell>
									<TableCell>
										<Avatar>
											<AvatarImage
												src={user.image!}
												alt={user.name!}
											/>
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
									</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge
											className='capitalize'
											variant={getRoleBadgeVariant(user.role!)}
										>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>{formatDate(user.createdAt!)}</TableCell>
									<TableCell>
										<Dialog>
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
													<DropdownMenuItem>Copy payment ID</DropdownMenuItem>
													<DropdownMenuItem>
														<Link href={`/dashboard/users/${user.id}`}>
															View customer
														</Link>
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
													You are about to permamently remove{' '}
													<strong>{user.name}</strong>'s data. This cannot be
													undone. Proceed with caution.
												</DialogDescription>

												{deleteUserState?.success === false && (
													<ErrorMessage message={deleteUserState?.message} />
												)}
												<DialogFooter>
													<DialogClose asChild>
														<Button
															variant='secondary'
															disabled={isDeletePending}
														>
															Cancel
														</Button>
													</DialogClose>

													<form action={deleteUserAction}>
														<input
															type='hidden'
															hidden
															readOnly
															name='userId'
															value={user.id}
														/>
														<SubmitButton
															variant='destructive'
															pendingText='Deleting'
															// disabled={isDeletePending}
														>
															Delete
														</SubmitButton>
													</form>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='icon'
					onClick={() => {
						if (!isPlaceholderData && data) movePage(-1)
					}}
					disabled={!data.success || page === 1}
				>
					<ArrowLeft />
				</Button>

				<Button
					variant='outline'
					size='icon'
					disabled={!data.success || !data.hasMore}
					onClick={() => movePage(1)}
				>
					<ArrowRight />
				</Button>
			</div>
		</div>
	)
}
