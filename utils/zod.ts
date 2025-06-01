import { z } from 'zod'

export const requiredString = z.string().trim().min(1, 'Required')

export const integerSchema = z.coerce
	.number({ invalid_type_error: 'Required' })
	.int()
	.finite()
