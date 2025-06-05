'use server'

import { db } from '@/db'
import { Coupon, coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type DeleteCouponReturn =
	| { success: true }
	| { success: false; message?: string }

export async function deleteCoupon(
	couponId: Coupon['id'],
	{ path }: { path?: string } = {}
): Promise<DeleteCouponReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['delete']))
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const coupon = await db.query.coupons.findFirst({
				where: eq(coupons.id, couponId),
				columns: { userId: true }
			})
			if (coupon?.userId !== currentUser.id)
				return {
					success: false,
					message: 'You can delete coupons created by Demo admin only'
				}
		}

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
