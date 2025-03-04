'use server'

import { db } from '@/db'
import { colors } from '@/db/schema/colors'
import { requirePermission } from '@/features/action-utils'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { newColorSchema } from '../zod'

export type CreateColorReturn =
	| { success: true; colorId: number }
	| { success: false; message: string }

export async function createColor(
	data: z.infer<typeof newColorSchema>,
	path = '/dashboard/colors'
) {
	try {
		await requirePermission('colors', ['create'])

		const parsed = newColorSchema.parse(data)

		const [newColor] = await db
			.insert(colors)
			.values({ ...parsed, slug: slugify(parsed.name) })
			.returning({ id: colors.id })

		revalidatePath(path)

		return { success: true, colorId: newColor.id }
	} catch (error: any) {
		console.error('[CREATE_COLOR]:', error)
		return {
			success: false,
			message:
				'Something went wrong while creating color. Please try again later.'
		}
	}
}
