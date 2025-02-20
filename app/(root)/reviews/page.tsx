import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { notFound } from 'next/navigation'

export default async function UserReviewsPage() {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'reviews', ['read:own']))
		notFound()

	return <div></div>
}
