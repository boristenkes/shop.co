'use server'

import { db } from '@/db'
import { subscribers } from '@/db/schema/subscribers.schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const emailSchema = z.string().trim().email()

export async function subcribeToNewsletter(email: string) {
	try {
		const validatedEmail = emailSchema.parse(email)

		const existingEmail = await db.query.subscribers.findFirst({
			where: eq(subscribers.email, validatedEmail)
		})

		if (existingEmail)
			return { success: false, message: 'This email is already subscribed.' }

		const newSubcriber = await db
			.insert(subscribers)
			.values({ email: validatedEmail })

		if (!newSubcriber)
			throw new Error('Failed to subscribe. Please try again later.')

		return { success: true, message: 'Subscribed successfully' }
	} catch (error: any) {
		console.error('[SUBSCRIBE_NEWSLETTER]:', error)
		return {
			success: false,
			message: 'Failed to subscribe to newsletter. Please try again later.'
		}
	}
}
