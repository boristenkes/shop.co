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
		users: ['read', 'update', 'delete']
	},
	moderator: {
		products: ['read', 'update'],
		orders: ['read', 'update'],
		carts: ['read', 'update'],
		reviews: ['read', 'update'],
		users: ['read']
	},
	customer: {
		products: ['read'],
		orders: ['create', 'read:own'],
		carts: ['create', 'read:own', 'update:own', 'delete:own'],
		reviews: ['read', 'create', 'delete:own', 'update:own'],
		users: []
	},
	anonymous: {
		products: ['read'],
		orders: [],
		carts: [],
		reviews: ['read'],
		users: []
	}
} as const

type Entity = 'products' | 'orders' | 'carts' | 'reviews' | 'users'
type Action =
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