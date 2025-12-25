import Avatar from '@/components/utils/avatar'
import { BackButton } from '@/components/utils/back-button'
import Paragraph from '@/components/utils/paragraph'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { timeFormatter } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import DeleteSelfButton from './delete-button'

export default async function ProfilePage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'users', ['read:own']))
		redirect('/')

	return (
		<main className='container py-12 space-y-12'>
			<div className='flex items-center gap-4'>
				<BackButton
					variant='outline'
					className='rounded-sm text-sm'
				>
					<ArrowLeft /> Back
				</BackButton>
				<h1 className='text-4xl font-semibold'>Your Profile</h1>
			</div>

			<div className='flex items-center gap-4'>
				<Avatar
					src={currentUser.image!}
					alt={currentUser.name}
					width={96}
					height={96}
				/>
				<div>
					<h2 className='text-xl font-medium'>{currentUser.name}</h2>
					<p>{currentUser.email}</p>
					<p>
						Joined:{' '}
						<time
							dateTime={new Date(currentUser.createdAt).toISOString()}
							className='font-medium'
						>
							{timeFormatter.format(new Date(currentUser.createdAt))}
						</time>
					</p>
				</div>
			</div>

			<footer>
				<h2 className='text-lg border-b pb-2 text-red-600 border-b-red-200'>
					Danger zone
				</h2>

				<Paragraph className='py-4'>
					By deleting your account, you&apos;re permamently deleting all your
					data from our database. All reviews you left on products will be
					deleted, as well as your orders and your cart. This cannot be undone.
					Proceed with caution.
				</Paragraph>

				<DeleteSelfButton userId={currentUser.id} />
			</footer>
		</main>
	)
}
