import { couponTypes, orderStatuses, roles, sizes } from '@/lib/enums'
import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', roles)

export const sizeEnum = pgEnum('size', sizes)

export const orderStatusEnum = pgEnum('order_status', orderStatuses)

export const couponTypeEnum = pgEnum('coupon_type', couponTypes)
