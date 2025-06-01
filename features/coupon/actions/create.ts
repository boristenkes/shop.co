'use server'

import { db } from '@/db'
import { coupons, NewCoupon } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { newCouponSchema } from '../zod'

export type CreateCouponReturn =
	| { success: true }
	| { success: false; message?: string }

export async function createCoupon(
	data: NewCoupon,
	{ path }: { path?: string } = {}
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['create']))
			throw new Error('Unauthorized')

		const parsedData = newCouponSchema.parse(data)

		const existingCoupon = await db.query.coupons
			.findFirst({
				where: (coupon, { eq }) => eq(coupon.code, parsedData.code),
				columns: { id: true }
			})
			.then(Boolean)

		if (existingCoupon) {
			return { success: false, message: 'Coupon with this code already exists' }
		}

		await db.insert(coupons).values(parsedData)

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_COUPON]:', error)
		return { success: false }
	}
}
