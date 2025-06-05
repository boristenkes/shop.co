'use server'

import { DEMO_RESTRICTIONS } from '@/constants'
import { db } from '@/db'
import { coupons } from '@/db/schema/coupons'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { stripe } from '@/lib/stripe'
import { toCents } from '@/utils/helpers'
import { revalidatePath } from 'next/cache'
import { NewCouponSchema, newCouponSchema } from '../zod'
import { countDemoCoupons } from './read'

export type CreateCouponReturn =
	| { success: true }
	| { success: false; message?: string }

export async function createCoupon(
	data: NewCouponSchema,
	{ path }: { path?: string } = {}
) {
	try {
		const session = await auth()
		const currentUser = session?.user

		if (!currentUser || !hasPermission(currentUser.role, 'coupons', ['create']))
			throw new Error('Unauthorized')

		if (currentUser.role === 'admin:demo') {
			const response = await countDemoCoupons()
			if (!response.success || response.count >= DEMO_RESTRICTIONS.MAX_COUPONS)
				return {
					success: false,
					message:
						'Demo limit reached. Please delete one of the coupons if you would like to create a new one.'
				}
		}

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

		if (parsedData.type === 'fixed')
			parsedData.value = toCents(parsedData.value)

		if (parsedData.minValueInCents)
			parsedData.minValueInCents = toCents(parsedData.minValueInCents)

		const stripeCoupon = await stripe.coupons.create({
			...(parsedData.type === 'fixed'
				? { amount_off: parsedData.value }
				: { percent_off: parsedData.value }),
			currency: 'usd'
		})

		const stripePromoCode = await stripe.promotionCodes.create({
			code: parsedData.code,
			coupon: stripeCoupon.id,
			max_redemptions: parsedData.maxUses ?? undefined,
			expires_at: parsedData.expiresAt
				? Math.floor(parsedData.expiresAt.getTime() / 1000)
				: undefined,
			active: parsedData.active ?? true,
			restrictions: {
				minimum_amount: parsedData.minValueInCents ?? undefined,
				minimum_amount_currency: parsedData.minValueInCents ? 'usd' : undefined
			}
		})

		await db.insert(coupons).values({
			...parsedData,
			userId: currentUser.id,
			stripeCouponId: stripeCoupon.id,
			stripePromoCodeId: stripePromoCode.id
		})

		if (path) revalidatePath(path)

		return { success: true }
	} catch (error) {
		console.error('[CREATE_COUPON]:', error)
		return { success: false }
	}
}
