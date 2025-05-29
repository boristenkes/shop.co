'use server'

import { db } from '@/db'
import { User, users } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { requirePermission } from '@/utils/actions'
import { desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

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

		if (!currentUser || !hasPermission(currentUser.role, 'users', ['read']))
			throw new Error('Unauthorized')

		const results = await db.query.users.findMany({
			orderBy: desc(users.id),
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

export type GetUserByIdUser = Omit<
	User,
	'emailVerified' | 'hashedPassword' | 'updatedAt'
>

export type GetUserByIdReturn =
	| { success: true; user: GetUserByIdUser }
	| { success: false }

export async function getUserById(
	userId: User['id']
): Promise<GetUserByIdReturn> {
	try {
		await requirePermission('users', ['read'])

		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
			columns: {
				emailVerified: false,
				hashedPassword: false,
				updatedAt: false
			}
		})

		if (!user) notFound()

		return { success: true, user }
	} catch (error) {
		console.error('[GET_USER_BY_ID]:', error)
		return { success: false }
	}
}
