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

export const unslugify = (str: string) => {
	const words = str.split('-')
	const upper = words.map(
		word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	)
	return upper.join(' ')
}

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
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}
) {
	return new Intl.DateTimeFormat('en-US', {
		...options
	}).format(new Date(date))
}

export function getTimeDistanceFromNow(date: Date): string {
	const now = new Date()
	const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)

	const intervals = {
		year: 60 * 60 * 24 * 365,
		month: 60 * 60 * 24 * 30,
		week: 60 * 60 * 24 * 7,
		day: 60 * 60 * 24,
		hour: 60 * 60,
		minute: 60,
		second: 1
	}

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

	for (const [unit, secondsInUnit] of Object.entries(intervals)) {
		if (Math.abs(diffInSeconds) >= secondsInUnit || unit === 'second') {
			const value = Math.round(diffInSeconds / secondsInUnit)
			return rtf.format(value, unit as Intl.RelativeTimeFormatUnit)
		}
	}

	return ''
}

export function calculatePriceWithDiscount(
	priceInCents: number,
	discountPercentage: number
): number {
	if (priceInCents < 0 || discountPercentage < 0 || discountPercentage > 100)
		return 0

	if (discountPercentage === 0) return priceInCents

	const discount = (priceInCents * discountPercentage) / 100
	const discountedPriceInCents = Math.round(priceInCents - discount)

	return discountedPriceInCents
}

export function limitTextLength(text: string, limit: number) {
	return text.length > limit ? text.slice(0, limit) : text
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

export const average = (array: number[]) => {
	if (array.length === 0) return 0

	return array.reduce((a, b) => a + b) / array.length
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

export function darkenHex(hex: string, amount: number = 20) {
	let r = parseInt(hex.slice(1, 3), 16) - amount
	let g = parseInt(hex.slice(3, 5), 16) - amount
	let b = parseInt(hex.slice(5, 7), 16) - amount

	r = Math.max(r, 0)
	g = Math.max(g, 0)
	b = Math.max(b, 0)

	return `#${r.toString(16).padStart(2, '0')}${g
		.toString(16)
		.padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
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
