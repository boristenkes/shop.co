import { Pool, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'
import * as schema from './schema'

neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const db = drizzle({ client: pool, casing: 'snake_case', schema, ws })

// import { drizzle } from 'drizzle-orm/neon-http'
// import * as schema from './schema'

// export const db = drizzle(process.env.DATABASE_URL!, {
// 	casing: 'snake_case',
// 	schema
// })
