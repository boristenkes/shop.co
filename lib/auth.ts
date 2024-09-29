import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
		} & DefaultSession['user']
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			profile: profile => ({
				role: profile.role ?? UserRole.customer,
				...profile
			}),
			allowDangerousEmailAccountLinking: true
		})
	],
	callbacks: {
		session: ({ session, token, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id
			}
		})
		// async signIn({ user, account, profile }) {
		// 	if (account?.provider === 'google') {
		// 		const existingUser = await db.select().from(users).where(eq(users.id, account.userId!))

		// 	}

		// 	return true
		// },
	}
})
