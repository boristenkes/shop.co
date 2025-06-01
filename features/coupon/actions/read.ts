'use server'

import { db } from '@/db'
import { Coupon } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export type GetCouponsReturn =
	| { success: true; coupons: Coupon[] }
	| { success: false }

export async function getCoupons(): Promise<GetCouponsReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['read']))
			throw new Error('Unauthorized')

		const coupons = await db.query.coupons.findMany({
			orderBy: (coupon, { desc }) => desc(coupon.id)
		})

		return { success: true, coupons }
	} catch (error) {
		console.error('[GET_COUPONS]:', error)
		return { success: false }
	}
}

export type GetCouponByIdReturn =
	| { success: true; coupon: Coupon }
	| { success: false; message?: string }

export async function getCouponById(
	couponId: Coupon['id']
): Promise<GetCouponByIdReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['read']))
			throw new Error('Unauthorized')

		const coupon = await db.query.coupons.findFirst({
			where: (coupon, { eq }) => eq(coupon.id, couponId)
		})

		if (!coupon) return { success: false, message: 'Coupon not found' }

		return { success: true, coupon }
	} catch (error) {
		console.error('[GET_COUPON_BY_ID]:', error)
		return { success: false }
	}
}
