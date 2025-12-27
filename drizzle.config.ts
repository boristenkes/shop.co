import { defineConfig } from 'drizzle-kit'
import { TABLE_NAME_PREFIX } from './db/schema/_root'
import { env } from './lib/env'

export default defineConfig({
	out: './db/migrations',
	schema: './db/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL
	},
	casing: 'snake_case',
	tablesFilter: [`${TABLE_NAME_PREFIX}*`]
})
