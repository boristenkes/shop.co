import ErrorMessage from '@/components/error-message'
import { Badge } from '@/components/ui/badge'
import Avatar from '@/components/utils/avatar'
import CopyButton from '@/components/utils/copy-button'
import { Role, TRole } from '@/db/schema/enums'
import { getUserById, GetUserByIdUser } from '@/features/user/actions/read'
import DeleteUserButton from '@/features/user/components/delete-button'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatDate } from '@/utils/format'
import { getRoleBadgeVariant } from '@/utils/helpers'
import { Loader2Icon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import RoleSelect from './_components/role-select'
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
			<UserHeader
				user={user}
				currentUserRole={currentUser.role}
			/>
			<Suspense
				fallback={<Loader2Icon className='animate-spin mx-auto my-16' />}
			>
				<UserReviews userId={user.id} />
			</Suspense>
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
				<div className='flex items-start justify-between gap-2'>
					<h1 className='text-5xl font-bold'>{user.name}</h1>
					{hasPermission(currentUserRole, 'users', ['delete']) && (
						<DeleteUserButton userId={user.id} />
					)}
				</div>
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
