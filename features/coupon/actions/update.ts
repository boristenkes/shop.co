'use server'

import { db } from '@/db'
import { Coupon, coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { toCents } from '@/utils/helpers'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { editCouponSchema } from '../zod'

export type UpdateCouponReturn =
	| { success: true }
	| { success: false; message?: string }

export async function updateCoupon(
	couponId: Coupon['id'],
	newData: Partial<Coupon>,
	{ path }: { path?: string } = {}
): Promise<UpdateCouponReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['update']))
			throw new Error('Unauthorized')

		if (newData.code) {
			const existingCoupon = await db.query.coupons.findFirst({
				where: (coupon, { eq }) => eq(coupon.code, newData.code!),
				columns: { id: true }
			})

			if (existingCoupon && existingCoupon.id !== couponId) {
				return { success: false, message: 'Coupon code already exists' }
			}
		}

		if (newData.type && newData.value) {
			newData.value =
				newData.type === 'fixed' ? toCents(newData.value) : newData.value
		}

		if (newData.minValueInCents)
			newData.minValueInCents = toCents(newData.minValueInCents)

		const parsedData = editCouponSchema.parse(newData)

		await db.update(coupons).set(parsedData).where(eq(coupons.id, couponId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[UPDATE_COUPON]', error)
		return { success: false }
	}
}
