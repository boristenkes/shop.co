import { type UserRole as UserRoleEnum, UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'

declare module 'next-auth' {
	interface Session {
		user: DefaultSession['user'] & {
			id: string
			role: UserRoleEnum
		}
	}
}

// TRY TO IMPLEMENT AUTH WITH NEXT-AUTH PRISMA ADAPTER

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true
		})
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider !== 'google') return false

			console.log('signIn user:', user)

			const existingUser = await prisma.user.findUnique({
				where: { email: user.email! }
			})

			console.log('[EXISTING_USER]', existingUser)

			if (existingUser) {
				user.id = existingUser.id
				user.role = existingUser.role
				return user
			}

			const newUser = await prisma.user.create({
				data: {
					email: user.email,
					image: user.image || profile?.picture,
					name: user.name || profile?.name
				}
			})

			if (newUser) {
				user.id = newUser.id
				user.role = newUser.role
				return user
			}

			return false
		},
		session: ({ session, token }) => {
			console.log('SESSION_CALLBACK', { session, token })
			session.user = {
				...session.user,
				id: token.id as string,
				role: token.role as UserRole
			}
			return session
		},
		jwt: async ({ token, user }) => {
			console.log('JWT_CALLBACK', { token, user })
			if (user) {
				token.id = user.id
				token.role = (user as any).role
			} else {
				const dbUser = await prisma.user.findUnique({
					where: { id: token.id as string }
				})
				token.role = dbUser?.role || UserRole.customer
			}
			return token
		}
	}
})

export const isAdmin = async () => {
	const session = await auth()

	const user = session?.user

	return user?.role === UserRole.admin
}

export const checkAuthorization = async () => {
	const session = await auth()

	console.log('[SESSION_FROM_AUTH_FN]', session)

	if (session?.user?.role !== UserRole.admin) throw new Error('Unauthorized')
}
