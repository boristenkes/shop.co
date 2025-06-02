'use server'

import { db } from '@/db'
import { Coupon, coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { stripe } from '@/lib/stripe'
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

		const [deletedCoupon] = await db
			.delete(coupons)
			.where(eq(coupons.id, couponId))
			.returning({
				stripeCouponId: coupons.stripeCouponId,
				stripePromoCodeId: coupons.stripePromoCodeId
			})

		if (deletedCoupon) {
			await Promise.all([
				stripe.coupons.del(deletedCoupon.stripeCouponId),
				stripe.promotionCodes.update(deletedCoupon.stripePromoCodeId, {
					active: false
				})
			])
		}

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[DELETE_COUPON]', error)
		return { success: false }
	}
}
