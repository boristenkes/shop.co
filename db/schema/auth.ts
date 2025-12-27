import {
	boolean,
	integer,
	primaryKey,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { createTable } from './_root'
import { users } from './users'

export const accounts = createTable(
	'accounts',
	{
		userId: text()
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

export const sessions = createTable('sessions', {
	sessionToken: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp({ mode: 'date' }).notNull()
})

export const verificationTokens = createTable(
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

export const authenticators = createTable(
	'authenticators',
	{
		credentialID: text().notNull().unique(),
		userId: text()
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
