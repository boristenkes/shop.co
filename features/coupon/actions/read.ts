'use server'

import { db } from '@/db'
import { Coupon, coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { formatPrice } from '@/utils/format'
import { eq } from 'drizzle-orm'
import { ClientCouponSchema, clientCouponSchema, couponSchema } from '../zod'

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

export type ApplyCouponReturn =
	| { success: true; coupon: ClientCouponSchema }
	| { success: false; message?: string }

export async function validateCoupon(
	couponCode: Coupon['code'],
	orderValueInCents: number
): Promise<ApplyCouponReturn> {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser) {
			return {
				success: false,
				message: 'You must be signed in to apply a coupon'
			}
		}

		const parsedCouponCode = couponSchema.shape.code.parse(couponCode)

		const coupon = await db.query.coupons.findFirst({
			where: eq(coupons.code, parsedCouponCode),
			columns: { description: false }
		})

		if (!coupon) return { success: false, message: 'Invalid coupon' }

		const validationResult = isCouponValid(coupon, orderValueInCents)

		if (!validationResult.success) return validationResult

		const parsedCoupon = clientCouponSchema.parse(coupon)

		return { success: true, coupon: parsedCoupon }
	} catch (error) {
		console.error('[APPLY_COUPON]:', error)
		return { success: false }
	}
}

type CouponValidationResult =
	| { success: true }
	| { success: false; message?: string }

function isCouponValid(
	coupon: Omit<Coupon, 'description'>,
	orderValueInCents: number
): CouponValidationResult {
	if (!coupon.active) {
		return { success: false, message: 'Invalid coupon' }
	}
	if (coupon.expiresAt && coupon.expiresAt.getTime() <= Date.now()) {
		return { success: false, message: 'This coupon is expired' }
	}
	if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
		return { success: false, message: 'Invalid coupon' }
	}
	if (coupon.minValueInCents && orderValueInCents < coupon.minValueInCents) {
		return {
			success: false,
			message: `Order total must be at least ${formatPrice(
				coupon.minValueInCents
			)}`
		}
	}

	return { success: true }
}
