import { Role, TRole } from '@/db/schema/enums'
import { clsx, type ClassValue } from 'clsx'
import slugifyOriginal from 'slugify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const prettyJson = (json: unknown) => JSON.stringify(json, null, 2)

export const slugify = (str: string) =>
	slugifyOriginal(str, {
		lower: true,
		strict: true
	})

export function getInitials(name?: string | null) {
	if (!name?.length) return ''

	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.slice(0, 2)
		.map(word => word[0].toUpperCase())
		.join('')
}

export function formatDate(
	date: Date | string | number,
	options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}
) {
	return new Intl.DateTimeFormat('en-US', {
		...options
	}).format(new Date(date))
}

export function calculatePriceWithDiscount(
	priceInCents: number,
	discountPercentage: number
): number {
	if (priceInCents < 0 || discountPercentage < 0 || discountPercentage > 100)
		return 0

	const discount = (priceInCents * discountPercentage) / 100
	const discountedPriceInCents = Math.round(priceInCents - discount)

	return discountedPriceInCents
}

export function formatPrice(
	priceInCents: number | string,
	options: Intl.NumberFormatOptions = {}
) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: options.currency ?? 'USD',
		notation: options.notation ?? 'standard',
		...options
	}).format(Number(priceInCents) / 100)
}

export function formatInt(int: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'decimal'
	}).format(int)
}

export function getUploadthingKey(imageUrl: string): string {
	return imageUrl.split('/f/').pop() as string
}

export const toCents = (usd: number) => Math.round(usd * 100)

export const absoluteUrl = (path: string) =>
	new URL(path, process.env.NEXT_PUBLIC_APP_URL).href

export function formatFileSize(sizeInBytes: number) {
	if (sizeInBytes === 0) return '0 Bytes'

	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
	const formattedSize = parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2))

	return `${formattedSize} ${units[i]}`
}

export function getRoleBadgeVariant(role: TRole) {
	switch (role) {
		case Role.ADMIN:
			return 'destructive'
		case Role.MODERATOR:
			return 'default'
		default:
			return 'outline'
	}
}
