import { drizzle } from 'drizzle-orm/neon-http'
import * as authSchema from './schema/auth.schema'
import * as cartsSchema from './schema/carts.schema'
import * as categoriesSchema from './schema/categories.schema'
import * as colorsSchema from './schema/colors.schema'
import * as enums from './schema/enums'
import * as ordersSchema from './schema/orders.schema'
import * as productImagesSchema from './schema/product-images.schema'
import * as productsToColorsSchema from './schema/products-to-colors'
import * as productsSchema from './schema/products.schema'
import * as reviewsSchema from './schema/reviews.schema'
import * as usersSchema from './schema/users.schema'

const schema = {
	...authSchema,
	...cartsSchema,
	...categoriesSchema,
	...colorsSchema,
	...enums,
	...ordersSchema,
	...productImagesSchema,
	...productsToColorsSchema,
	...productsSchema,
	...reviewsSchema,
	...usersSchema
}

export const db = drizzle(process.env.DATABASE_URL!, {
	casing: 'snake_case',
	schema
})
