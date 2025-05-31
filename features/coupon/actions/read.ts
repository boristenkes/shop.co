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
