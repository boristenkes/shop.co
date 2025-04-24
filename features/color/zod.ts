import { z } from 'zod'

export const hexCodeRegex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i

export const newColorSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	hexCode: z.string().trim().regex(hexCodeRegex, 'Invalid color code')
})

export const colorSchema = z.object({
	id: z.number().positive().finite(),
	slug: z.string().min(1),
	name: z.string().min(1),
	hexCode: z.string().regex(hexCodeRegex)
})
