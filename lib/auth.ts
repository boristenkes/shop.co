import { db } from '@/db'
import {
	accounts,
	authenticators,
	sessions,
	verificationTokens
} from '@/db/schema/auth.schema'
import { User, users } from '@/db/schema/users.schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
	interface Session {
		user: DefaultSession['user'] & User
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		// @ts-expect-error DrizzleAdapter doesn't like my schemas
		accountsTable: accounts, usersTable: users, authenticatorsTable: authenticators, sessionsTable: sessions, verificationTokensTable: verificationTokens
	}),
	providers: [Google],
	session: {
		strategy: 'database'
	},
	trustHost: true
})

