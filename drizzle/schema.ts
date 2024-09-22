import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const roleEnum = pgEnum('role', ['customer', 'admin'])

const id = uuid('id').primaryKey().defaultRandom().notNull()

// const id = text('id')
// 	.primaryKey()
// 	.$defaultFn(() => crypto.randomUUID())

export const users = pgTable('user', {
	id,
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	password: text('password'),
	image: text('image'),
	role: roleEnum('role').default('customer')
})

export const accounts = pgTable(
	'account',
	{
		userId: uuid('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	account => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
)

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	verificationToken => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token]
		})
	})
)

export const sizeEnum = pgEnum('size', [
	'XS',
	'S',
	'M',
	'L',
	'XL',
	'2XL',
	'3XL'
])

export const categories = pgTable('category', {
	id,
	name: text('name').notNull()
})

export const colors = pgTable('colors', {
	id,
	name: text('name').notNull(),
	hex: text('hex').notNull()
})

export const products = pgTable('product', {
	id,
	name: text('name').notNull(),
	price: integer('price').notNull(),
	description: text('description').notNull(),
	sizes: sizeEnum('sizes').array(),
	stock: integer('stock').default(0),
	featured: boolean('featured').default(false),
	archived: boolean('archived').default(false),
	images: text('images').array().notNull(),
	discount: smallint('discount'),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date())
})

export const productRelations = relations(products, ({ many }) => ({
	categories: many(categories),
	colors: many(colors)
}))

export const orders = pgTable('order', {
	id,
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	paid: boolean('paid').default(false),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date())
})

export const orderItems = pgTable('order_item', {
	id,
	orderId: uuid('order_id')
		.notNull()
		.references(() => orders.id),
	productId: uuid('products')
		.notNull()
		.references(() => products.id),
	quantity: integer('quantity').notNull(),
	size: sizeEnum('size').notNull(),
	color: uuid('color')
		.notNull()
		.references(() => colors.id)
})

export const reviews = pgTable('review', {
	id,
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	productId: uuid('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date())
})
