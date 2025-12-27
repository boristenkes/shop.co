import { pgTableCreator } from 'drizzle-orm/pg-core'

export const TABLE_NAME_PREFIX = 'shopco__'

export const createTable = pgTableCreator(name => TABLE_NAME_PREFIX + name)
