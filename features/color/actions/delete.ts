'use server'

import { db } from '@/db'
import { colors } from '@/db/schema/colors'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type DeleteColoReturn =
	| { success: true; colorId: number }
	| { success: false; message: string }

export async function deleteColor(
	prev: any,
	formData?: FormData,
	path = '/dashboard/colors'
): Promise<DeleteColoReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (
			!currentUser ||
			!hasPermission(currentUser.role, 'categories', ['delete'])
		)
			throw new Error('Unauthorized')

		const colorId =
			typeof prev === 'number' ? prev : Number(formData?.get('colorId'))

		// 20 = ID of last color I inserted
		if (currentUser.role === 'admin:demo' && colorId <= 20) {
			return {
				success: false,
				message: 'You can delete colors created by Demo admin only'
			}
		}

		await db.delete(colors).where(eq(colors.id, colorId))

		revalidatePath(path)

		return { success: true, colorId }
	} catch (error) {
		console.error('[DELETE_COLOR]:', error)
		return {
			success: false,
			message: 'Failed to delete color. Please try again later.'
		}
	}
}
