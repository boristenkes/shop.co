'use server'

import { db } from '@/db'
import { Color } from '@/db/schema/colors'

export type GetColorsReturn =
	| { success: true; colors: Color[] }
	| { success: false; message: string }

export async function getColors(): Promise<GetColorsReturn> {
	try {
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

export async function getColorsForCustomer() {
	return db.query.colors.findMany()
}
