import { pgEnum } from 'drizzle-orm/pg-core'

// Role

export const roleEnum = pgEnum('role', [
	'admin',
	'customer',
	'moderator',
	'anonymous'
])

export const Role = {
	ADMIN: 'admin',
	CUSTOMER: 'customer',
	MODERATOR: 'moderator',
	ANONYMOUS: 'anonymous'
} as const

export type TRole = (typeof Role)[keyof typeof Role]

// Size

export const sizeEnum = pgEnum('size', [
	'XS',
	'S',
	'M',
	'L',
	'XL',
	'XXL',
	'XXXL'
])

export const Size = {
	XS: 'XS',
	S: 'S',
	M: 'M',
	L: 'L',
	XL: 'XL',
	XXL: 'XXL',
	XXXL: 'XXXL'
} as const

export type TSize = (typeof Size)[keyof typeof Size]

// Order Status

export const orderStatusEnum = pgEnum('order_status', [
	'pending',
	'shipped',
	'delivered',
	'canceled'
])

export const OrderStatus = {
	PENDING: 'pending',
	SHIPPED: 'shipped',
	DELIVERED: 'delivered',
	CANCELED: 'canceled'
} as const

export type TOrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

// Coupon Type

export const couponTypeEnum = pgEnum('coupon_type', ['percentage', 'fixed'])
