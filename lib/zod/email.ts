import { z } from 'zod'

export const emailSchema = z.string().trim().email()
