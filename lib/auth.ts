import { type UserRole as UserRoleEnum, UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: UserRoleEnum
		} & DefaultSession['user']
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
		session: ({ session, token, user }) => {
			// ({
			// 	...session,
			// 	user: {
			// 		...session.user,
			// 		id: user.id
			// 	}
			// })
			session.user.id = token.id as string
			session.user.role = token.role as UserRoleEnum
			return session
		},
		async signIn({ user, account, profile }) {
			if (account?.provider !== 'google') return false

			const existingUser = await prisma.user.findUnique({
				where: { email: user.email! }
			})

			if (existingUser) return true

			const newUser = await prisma.user.create({
				data: {
					email: user.email,
					image: user.image || profile?.picture,
					name: user.name || profile?.name
				}
			})

			if (newUser) return true

			return false
		},
		jwt({ token, user }) {
			if (user) token.role = user.role
			return token
		}
	}
})
