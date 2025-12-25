import { defineConfig } from 'drizzle-kit'
import { env } from './lib/env'

export default defineConfig({
	out: './db/migrations',
	schema: './db/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL
	},
	casing: 'snake_case'
})
