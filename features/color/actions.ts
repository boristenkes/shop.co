'use server'

import { db } from '@/db'
import { Color, colors, NewColor } from '@/db/schema/colors.schema'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { newColorSchema } from './zod'

export type CreateColorReturn =
	| { success: true; colorId: number }
	| { success: false; message: string }

export async function createColor(data: NewColor, path = '/dashboard/colors') {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role!, 'colors', ['create']))
			throw new Error('Unauthorized')

		const parsed = newColorSchema.parse(data)

		const [newColor] = await db
			.insert(colors)
			.values(parsed)
			.returning({ id: colors.id })

		revalidatePath(path)

		return { success: true, colorId: newColor.id }
	} catch (error: any) {
		console.error('[CREATE_COLOR]:', error)
		return { success: false, message: error.message }
	}
}

export type GetColorsReturn =
	| { success: true; colors: Color[] }
	| { success: false; message: string }

export async function getColors(): Promise<GetColorsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role!, 'colors', ['read']))
			throw new Error('Unauthorized')

		const results = await db.query.colors.findMany()

		return { success: true, colors: results }
	} catch (error) {
		console.error('[GET_COLORS]:', error)
		return {
			success: false,
			message: 'Failed to get colors. Please try again later.'
		}
	}
}

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

		if (!currentUser || !hasPermission(currentUser.role!, 'colors', ['delete']))
			throw new Error('Unauthorized')

		const colorId =
			typeof prev === 'number' ? prev : Number(formData?.get('colorId'))

		const response = await db.delete(colors).where(eq(colors.id, colorId))

		if (response.rowCount < 1)
			throw new Error(`Failed to delete color with ID:${colorId}`)

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