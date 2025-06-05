'use server'

import { DEMO_RESTRICTIONS } from '@/constants'
import { db } from '@/db'
import { colors } from '@/db/schema/colors'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { slugify } from '@/lib/utils'
import { gt } from 'drizzle-orm'
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
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'colors', ['create']))
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const count = await db.$count(colors, gt(colors.id, 33)) // 33 = ID of last color I inserted

			if (count >= DEMO_RESTRICTIONS.MAX_COLORS)
				return {
					success: false,
					message:
						'Demo limit reached. Please delete one of the colors if you would like to create a new one'
				}
		}

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
