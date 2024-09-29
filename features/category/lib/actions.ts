'use server'

import { prisma } from '@/lib/prisma'

export async function fetchCategories() {
	const categories = await prisma.category.findMany()

	return categories
}
