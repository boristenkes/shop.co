'use server'

import { db } from '@/db'
import { users } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type DeleteUserConfig = {
	path?: string
	throwOnError?: boolean
}

type DeleteUserReturn = { success: true } | { success: false; message?: string }

export async function deleteUser(
	prev: any,
	formData?: FormData,
	{ path = '/dashboard/users', throwOnError = false }: DeleteUserConfig = {}
): Promise<DeleteUserReturn> {
	try {
		// If user ID is passed as first parameter, use it
		// If `useActionState` is used, get `userId` from `formData`,
		const targetUserId =
			typeof prev === 'number'
				? prev
				: parseInt(formData?.get('userId') as string)

		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) throw new Error('Unauthorized')

		if (!hasPermission(currentUser.role, 'users', ['delete'])) {
			if (currentUser.role === 'admin:demo') {
				return {
					success: false,
					message: 'Demo admin cannot delete users'
				}
			}

			if (currentUser.id !== targetUserId) {
				throw new Error('Unauthorized')
			}

			if (!hasPermission(currentUser.role, 'users', ['delete:own'])) {
				throw new Error('Unauthorized')
			}
		}

		await db.delete(users).where(eq(users.id, targetUserId))

		revalidatePath(path)

		return { success: true }
	} catch (error: any) {
		console.error('[DELETE_USER]:', error)

		if (throwOnError)
			throw new Error(
				'Something went wrong while deleting user. Please try again later.'
			)

		return { success: false }
	}
}
