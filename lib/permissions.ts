import { TRole } from '@/db/schema/enums'

type Permissions = {
	[key in TRole]: {
		[key in Entity]: Action[]
	}
}

const permissions: Permissions = {
	admin: {
		products: ['read', 'create', 'update', 'delete'],
		orders: ['read', 'update', 'delete'],
		carts: ['read', 'delete'],
		reviews: ['read', 'update', 'delete'],
		users: ['read', 'read:own', 'update', 'delete'],
		categories: ['create', 'read', 'update', 'delete'],
		colors: ['create', 'read', 'update', 'delete']
	},
	moderator: {
		products: ['read', 'update'],
		orders: ['read', 'update'],
		carts: ['read', 'update'],
		reviews: ['read', 'update'],
		users: ['read'],
		categories: ['read'],
		colors: ['read']
	},
	customer: {
		products: ['read'],
		orders: ['create', 'read:own', 'update:own'],
		carts: ['create', 'read:own', 'update:own', 'delete:own'],
		reviews: ['create', 'read:own', 'delete:own', 'update:own'],
		users: ['read:own', 'delete:own'],
		categories: [],
		colors: []
	},
	anonymous: {
		products: ['read'],
		orders: [],
		carts: [],
		reviews: [],
		users: [],
		categories: [],
		colors: []
	}
} as const

export type Entity =
	| 'products'
	| 'orders'
	| 'carts'
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

export function hasPermission(role: TRole, entity: Entity, actions: Action[]) {
	const rolePermissions = permissions[role] || {}

	return actions.some(action => rolePermissions[entity]?.includes(action))
}
