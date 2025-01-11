'use server'

import { db } from '@/db'
import { User, users } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type GetUsersConfig = {
	throwOnError?: boolean
}

export type GetUsersReturn =
	| { success: true; users: Omit<User, 'hashedPassword'>[] }
	| { success: false; message: string }

export async function getUsers({
	throwOnError = false
}: GetUsersConfig = {}): Promise<GetUsersReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role!, 'users', ['read']))
			throw new Error('Unauthorized')

		const results = await db.query.users.findMany({
			orderBy: (users, { desc }) => [desc(users.createdAt)],
			columns: {
				hashedPassword: false
			}
		})

		return {
			success: true,
			users: results
		}
	} catch (error: any) {
		console.error('[GET_USERS]:', error)

		if (throwOnError)
			throw new Error(
				'Something went wrong while trying to later users. Please try again later'
			)

		return {
			success: false,
			message:
				'Something went wrong while trying to later users. Please try again later'
		}
	}
}

export type DeleteUserConfig = {
	path?: string
	throwOnError?: boolean
}

type DeleteUserReturn =
	| { success: true; userId: number }
	| { success: false; message: string }

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

		if (!session?.user?.id) throw new Error('Unauthorized')

		const currentUser = session.user

		if (
			currentUser.id === targetUserId &&
			!hasPermission(currentUser.role!, 'users', ['delete:own'])
		)
			throw new Error('Unauthorized')

		if (!hasPermission(currentUser.role!, 'users', ['delete']))
			throw new Error('Unauthorized')

		const response = await db.delete(users).where(eq(users.id, targetUserId))

		revalidatePath(path)

		return { success: true, userId: targetUserId }
	} catch (error: any) {
		console.error('[DELETE_USER]:', error)

		if (throwOnError)
			throw new Error(
				'Something went wrong while deleting user. Please try again later.'
			)

		return {
			success: false,
			message:
				'Something went wrong while deleting user. Please try again later.'
		}
	}
}
