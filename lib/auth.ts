import { db } from '@/drizzle/db'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: string
		} & DefaultSession['user']
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			profile: profile => ({ role: profile.role ?? 'customer', ...profile }),
			allowDangerousEmailAccountLinking: true
		})
	],
	callbacks: {
		session: ({ session, token, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
				role: user.role
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
