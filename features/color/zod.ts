import { requiredString } from '@/utils/zod'
import { z } from 'zod'

export const hexCodeRegex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i

export const newColorSchema = z.object({
	name: requiredString,
	hexCode: requiredString.regex(hexCodeRegex, 'Invalid color code')
})

export const colorSchema = z.object({
	id: z.number().positive().finite(),
	slug: requiredString,
	name: requiredString,
	hexCode: requiredString.regex(hexCodeRegex)
})
