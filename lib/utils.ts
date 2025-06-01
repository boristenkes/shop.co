import { clsx, type ClassValue } from 'clsx'
import slugifyOriginal from 'slugify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const slugify = (str: string) =>
	slugifyOriginal(str, {
		lower: true,
		strict: true
	})

export function calculatePriceWithDiscount(
	priceInCents: number,
	discountPercentage?: number
): number {
	if (!discountPercentage) return priceInCents

	if (priceInCents < 0 || discountPercentage < 0 || discountPercentage > 100)
		return 0

	if (discountPercentage === 0) return priceInCents

	const discount = (priceInCents * discountPercentage) / 100
	const discountedPriceInCents = Math.round(priceInCents - discount)

	return discountedPriceInCents
}
