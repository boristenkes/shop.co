import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import Avatar from '@/components/utils/avatar'
import { BackButton } from '@/components/utils/back-button'
import CopyButton from '@/components/utils/copy-button'
import { Role, TRole } from '@/db/schema/enums'
import { getUserById, GetUserByIdUser } from '@/features/user/actions/read'
import DeleteUserButton from '@/features/user/components/delete-button'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatDate } from '@/utils/format'
import { getRoleBadgeVariant } from '@/utils/helpers'
import { ArrowLeft, Loader2Icon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import RoleSelect from './_components/role-select'
import UserOrders from './_components/user-orders'
import UserReviews from './_components/user-reviews'

export default async function DashboardUsersPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'users', ['read']))
		redirect('/')

	const userId = parseInt((await props.params).id)
	const response = await getUserById(userId)

	if (!response.success) return <ErrorMessage message='Something went wrong' />

	const { user } = response

	return (
		<main className='container py-12 space-y-12'>
			<div className='flex items-center justify-between gap-4'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>

				{hasPermission(currentUser.role, 'users', ['delete']) && (
					<DeleteUserButton userId={user.id} />
				)}
			</div>

			<UserHeader
				user={user}
				currentUserRole={currentUser.role}
			/>

			<div className='flex items-start gap-8 max-lg:flex-col'>
				<Card className='basis-1/2 max-lg:w-full'>
					<CardHeader>
						<CardTitle>User Reviews</CardTitle>
						<CardDescription>
							List of all reviews this user posted.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{hasPermission(user.role, 'reviews', ['create']) ? (
							<Suspense
								fallback={
									<Loader2Icon className='animate-spin mx-auto my-16' />
								}
							>
								<UserReviews userId={user.id} />
							</Suspense>
						) : (
							<p className='text-center py-16'>This user cannot post reviews</p>
						)}
					</CardContent>
				</Card>

				<Card className='basis-1/2 max-lg:w-full'>
					<CardHeader>
						<CardTitle>User Orders</CardTitle>
						<CardDescription>
							List of all orders this user placed.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{hasPermission(user.role, 'orders', ['create']) ? (
							<Suspense
								fallback={
									<Loader2Icon className='animate-spin mx-auto my-16' />
								}
							>
								<UserOrders userId={user.id} />
							</Suspense>
						) : (
							<p className='text-center py-16'>This user cannot place orders</p>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	)
}

function UserHeader({
	user,
	currentUserRole
}: {
	user: GetUserByIdUser
	currentUserRole: TRole
}) {
	return (
		<header className='flex gap-8'>
			<Avatar
				src={user.image!}
				alt={user.name}
				width={192}
				height={192}
				className='size-48'
			/>

			<div className='space-y-2 grow'>
				<h1 className='text-5xl font-bold'>{user.name}</h1>

				<div className='flex items-center gap-2'>
					<a
						href={`mailto:${user.email}`}
						className='text-lg hover:underline'
					>
						{user.email}
					</a>
					<CopyButton text={user.email} />
				</div>

				<p>
					Joined on{' '}
					<time
						dateTime={user.createdAt?.toISOString()}
						className='font-medium'
					>
						{formatDate(user.createdAt!)}
					</time>
				</p>

				{user.role !== Role.ADMIN &&
				hasPermission(currentUserRole, 'users', ['update']) ? (
					<RoleSelect
						userId={user.id}
						defaultRole={user.role}
					/>
				) : (
					<Badge
						variant={getRoleBadgeVariant(user.role)}
						className='capitalize'
					>
						{user.role}
					</Badge>
				)}
			</div>
		</header>
	)
}
