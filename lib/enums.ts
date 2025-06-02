export const roles = [
	'admin',
	'admin:demo',
	'customer',
	'customer:demo',
	'moderator'
] as const

export type Role = (typeof roles)[number]

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const

export type Size = (typeof sizes)[number]

export const orderStatuses = [
	'pending',
	'shipped',
	'delivered',
	'canceled'
] as const

export type OrderStatus = (typeof orderStatuses)[number]

export const couponTypes = ['percentage', 'fixed'] as const

export type CouponType = (typeof couponTypes)[number]
