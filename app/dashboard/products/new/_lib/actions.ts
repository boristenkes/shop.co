'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
	try {
		const session = await auth()

		if (!session) throw new Error('Unauthorized')

		revalidatePath('/dashboard/products')

		return { success: true, message: 'Product has been created' }
	} catch (error: any) {
		console.error('[CREATE_PRODUCT]:', error)
		return { success: false, message: error.message as string }
	}
}
