// @ts-nocheck DrizzleAdapter doesn't like my schemas

import { db } from '@/db'
import {
	accounts,
	authenticators,
	sessions,
	verificationTokens
} from '@/db/schema/auth.schema'
import { users } from '@/db/schema/users.schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		accountsTable: accounts,
		usersTable: users,
		authenticatorsTable: authenticators,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),
	providers: [Google]
})
