import { z } from 'zod'

export const newColorSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	hexCode: z
		.string()
		.trim()
		.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid color code')
})
