import { Role } from '@/lib/enums'

type Permissions = {
	[key in Role]: {
		[key in Entity]: Action[]
	}
}

const permissions: Permissions = {
	admin: {
		products: ['read', 'create', 'update', 'delete'],
		orders: ['read', 'update', 'delete'],
		carts: ['read', 'delete'],
		coupons: ['read', 'create', 'update', 'delete'],
		reviews: ['read', 'update', 'delete'],
		users: ['read', 'read:own', 'update', 'delete'],
		categories: ['create', 'read', 'update', 'delete'],
		colors: ['create', 'read', 'update', 'delete']
	},
	'admin:demo': {
		products: ['read', 'create', 'delete:own', 'update:own'],
		orders: ['read', 'update'],
		carts: ['read', 'delete'],
		coupons: ['read', 'create', 'update:own', 'delete:own'],
		reviews: ['read', 'update'],
		users: ['read', 'read:own'],
		categories: ['create', 'read', 'update:own', 'delete:own'],
		colors: ['create', 'read', 'update:own', 'delete:own']
	},
	moderator: {
		products: ['read', 'update'],
		orders: ['read', 'update'],
		carts: ['read', 'update'],
		coupons: ['read', 'update'],
		reviews: ['read', 'update'],
		users: ['read'],
		categories: ['read'],
		colors: ['read']
	},
	customer: {
		products: ['read'],
		orders: ['create', 'read:own', 'update:own'],
		carts: ['create', 'read:own', 'update:own', 'delete:own'],
		coupons: ['read:own'],
		reviews: ['create', 'read:own', 'delete:own'],
		users: ['read:own', 'delete:own'],
		categories: [],
		colors: []
	},
	'customer:demo': {
		products: ['read'],
		orders: ['create', 'read:own', 'update:own'],
		carts: ['create', 'read:own', 'update:own', 'delete:own'],
		coupons: ['read:own'],
		reviews: ['create', 'read:own', 'delete:own'],
		users: ['read:own'],
		categories: [],
		colors: []
	}
} as const

export type Entity =
	| 'products'
	| 'orders'
	| 'carts'
	| 'coupons'
	| 'reviews'
	| 'users'
	| 'categories'
	| 'colors'
export type Action =
	| 'create'
	| 'read'
	| 'update'
	| 'delete'
	| 'read:own'
	| 'delete:own'
	| 'update:own'

export function hasPermission(role: Role, entity: Entity, actions: Action[]) {
	const rolePermissions = permissions[role] || {}

	return actions.some(action => rolePermissions[entity]?.includes(action))
}
