'use server'

import { db } from '@/db'
import { colors } from '@/db/schema/colors'
import { requirePermission } from '@/utils/actions'
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
		await requirePermission('colors', ['delete'])

		const colorId =
			typeof prev === 'number' ? prev : Number(formData?.get('colorId'))

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
