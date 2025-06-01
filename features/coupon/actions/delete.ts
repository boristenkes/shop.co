'use server'

import { db } from '@/db'
import { Coupon, coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type DeleteCouponReturn = {
	success: boolean
}

export async function deleteCoupon(
	couponId: Coupon['id'],
	{ path }: { path?: string } = {}
): Promise<DeleteCouponReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['delete']))
			throw new Error('Unauthorized')

		await db.delete(coupons).where(eq(coupons.id, couponId))

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_COUPON]', error)
		return { success: false }
	}
}
