import { Role, TRole } from '@/db/schema/enums'

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const prettyJson = (json: unknown) => JSON.stringify(json, null, 2)

export const { isArray } = Array

export function isEmpty(value: unknown): value is [] | Record<string, never> {
	if (!value || typeof value !== 'object') return true

	const { length } = isArray(value) ? value : Object.keys(value)

	return length === 0
}

export function getUploadthingKey(imageUrl: string): string {
	return imageUrl.split('/f/').pop() as string
}

export const toCents = (usd: number) => Math.round(usd * 100)

export const absoluteUrl = (path: string) =>
	new URL(path, process.env.NEXT_PUBLIC_APP_URL).href

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

export function getInitials(name?: string | null) {
	if (!name?.length) return ''

	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.slice(0, 2)
		.map(word => word[0].toUpperCase())
		.join('')
}

export const unslugify = (str: string) => {
	const words = str.split('-')
	const upper = words.map(
		word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	)
	return upper.join(' ')
}
