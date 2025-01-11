import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { users } from './users'

export const accounts = pgTable(
	'accounts',
	{
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text().$type<AdapterAccountType>().notNull(),
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refresh_token: text(),
		access_token: text(),
		expires_at: integer(),
		token_type: text(),
		scope: text(),
		id_token: text(),
		session_state: text()
	},
	account => [
		primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	]
)

export const sessions = pgTable('sessions', {
	sessionToken: text().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp({ mode: 'date' }).notNull()
})

export const verificationTokens = pgTable(
	'verification_tokens',
	{
		identifier: text().notNull(),
		token: text().notNull(),
		expires: timestamp({ mode: 'date' }).notNull()
	},
	verificationToken => [
		primaryKey({
			columns: [verificationToken.identifier, verificationToken.token]
		})
	]
)

export const authenticators = pgTable(
	'authenticators',
	{
		credentialID: text().notNull().unique(),
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text().notNull(),
		credentialPublicKey: text().notNull(),
		counter: integer().notNull(),
		credentialDeviceType: text().notNull(),
		credentialBackedUp: boolean().notNull(),
		transports: text()
	},
	authenticator => [
		primaryKey({
			columns: [authenticator.userId, authenticator.credentialID]
		})
	]
)
