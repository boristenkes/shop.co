'use server'

import { auth } from '@/lib/auth'
import { Action, Entity, hasPermission } from '@/lib/permissions'

export async function requirePermission(entity: Entity, actions: Action[]) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role!, entity, actions))
		throw new Error('Unauthorized')
}
