import { db } from '@/db'
import {
	accounts,
	authenticators,
	sessions,
	verificationTokens
} from '@/db/schema/auth'
import { User, users } from '@/db/schema/users'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { DefaultSession } from 'next-auth'
import { encode as defaultEncode } from 'next-auth/jwt'
import Google from 'next-auth/providers/google'
import CredentialProvider from 'next-auth/providers/credentials'
import { Role } from './enums'
import { v4 as uuid } from 'uuid'

declare module 'next-auth' {
	interface Session {
		user: DefaultSession['user'] & User
	}
}

const adapter = DrizzleAdapter(db, {
	// @ts-expect-error DrizzleAdapter doesn't like my schemas
	accountsTable: accounts, usersTable: users, authenticatorsTable: authenticators, sessionsTable: sessions, verificationTokensTable: verificationTokens
})

export const {
	handlers,
	signIn,
	signOut,
	auth
} = NextAuth({
	adapter,
	providers: [Google, CredentialProvider({
		credentials: {
			role: {}
		},
		// @ts-expect-error DrizzleAdapter expects users.id to be string
		async authorize(credentials) {
			const role = credentials.role as Role

		
			if (role !== 'admin:demo' && role !== 'customer:demo') return null

			const user = await db.query.users.findFirst({
				where: (user, { eq }) => eq(user.role, role),
				columns: {
					hashedPassword: false,
					emailVerified: false,
					updatedAt: false
				}
			})

			if (!user) return null

			return user
		}
	})],
	session: {
		strategy: 'database'
	},
	callbacks: {
		session({ session, user }) {
			// @ts-expect-error TODO
			session.user = { id: user.id, email: user.email, image: user.image, name: user.name, createdAt: user.createdAt, role: user.role }
			// @ts-expect-error TODO
			delete session.sessionToken
			return session
		},
		async jwt({ token, account }) {
			if (account?.provider === 'credentials')
				token.credentials = true
			return token
		}
	},
	jwt: {
		async encode(params) {
			if (params.token?.credentials) {
				const sessionToken = uuid()

				if (!params.token.sub) throw new Error('No user ID found in token')

				const createdSession = await adapter?.createSession?.({
					sessionToken,
					// @ts-expect-error DrizzleAdapter expects users.id to be string
					userId: Number(params.token.sub),
					expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1d
				})

				if (!createdSession) throw new Error('Failed to create session')

				return sessionToken
			}
			return defaultEncode(params)
		}
	},
	trustHost: true
})
