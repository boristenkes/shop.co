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
	providers: [Google]
})

export const isAdmin = async () => {
	const session = await auth()

	const user = session?.user

	return user?.role === Role.admin
}

export const checkAuthorization = async () => {
	const session = await auth()

	if (session?.user?.role !== Role.admin) throw new Error('Unauthorized')
}
