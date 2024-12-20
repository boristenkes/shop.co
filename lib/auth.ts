import { PrismaAdapter } from '@auth/prisma-adapter'
import { type Role as UserRole, Role } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'

declare module 'next-auth' {
	interface Session {
		user: DefaultSession['user'] & {
			id: string
			role: UserRole
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Google],
	session: {
		strategy: 'database'
	}
})

export const isAdmin = async () => {
	const session = await auth()

	return session?.user?.role === Role.ADMIN
}

export const checkAuthorization = async () => {
	const isAuthorized = await isAdmin()

	if (!isAuthorized) throw new Error('Unauthorized')
}
