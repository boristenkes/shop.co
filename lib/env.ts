import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		AUTH_SECRET: z.string(),
		AUTH_GOOGLE_ID: z.string(),
		AUTH_GOOGLE_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		AUTH_DRIZZLE_URL: z.string().url(),
		UPLOADTHING_TOKEN: z.string(),
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		NODE_ENV: z.enum(['development', 'test', 'production'])
	},
	client: {
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_APP_URL: z.string().url()
	},
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		AUTH_DRIZZLE_URL: process.env.AUTH_DRIZZLE_URL,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

		NODE_ENV: process.env.NODE_ENV
	}
})
