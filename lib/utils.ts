import { clsx, type ClassValue } from 'clsx'
import slugifyOriginal from 'slugify'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const prettyJson = (json: unknown) => JSON.stringify(json, null, 2)

export const slugify = (str: string) =>
	slugifyOriginal(str, {
		lower: true,
		strict: true
	})

export function getInitials(name: string) {
	if (!name.length) return name

	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.map(word => word[0].toUpperCase())
		.slice(0, 2)
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

export function formatPrice(
	price: number | string,
	options: Intl.NumberFormatOptions = {}
) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: options.currency ?? 'USD',
		notation: options.notation ?? 'compact',
		...options
	}).format(Number(price))
}

export const absoluteUrl = (path: string) =>
	new URL(path, process.env.NEXT_PUBLIC_APP_URL).href

export function formatFileSize(size: number) {
	if (size === 0) return '0 Bytes'

	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(size) / Math.log(1024))
	const formattedSize = parseFloat((size / Math.pow(1024, i)).toFixed(2))

	return `${formattedSize} ${units[i]}`
}
