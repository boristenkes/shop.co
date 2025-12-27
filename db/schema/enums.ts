import { couponTypes, orderStatuses, roles, sizes } from '@/lib/enums'
import { pgEnum } from 'drizzle-orm/pg-core'
import { TABLE_NAME_PREFIX } from './_root'

const prefixEnumName = (name: string) => TABLE_NAME_PREFIX + name

export const roleEnum = pgEnum(prefixEnumName('role'), roles)

export const sizeEnum = pgEnum(prefixEnumName('size'), sizes)

export const orderStatusEnum = pgEnum(
	prefixEnumName('order_status'),
	orderStatuses
)

export const couponTypeEnum = pgEnum(prefixEnumName('coupon_type'), couponTypes)
