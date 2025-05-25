'use server'

import { db } from '@/db'
import { Role } from '@/db/schema/enums'
import { User, users } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { requirePermission } from '@/utils/actions'
import { eq } from 'drizzle-orm'

export async function updateUser(userId: User['id'], newData: Partial<User>) {
	try {
		await requirePermission('users', ['update'])

		// Ensure only admin can assign role
		if (newData.role) {
			const session = await auth()

			if (session?.user.role !== Role.ADMIN) throw new Error('Unauthorized')
		}

		await db.update(users).set(newData).where(eq(users.id, userId))

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_USER]:', error)
		return { success: false }
	}
}
