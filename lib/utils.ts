import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
	if (!name.length) return name

	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.map(word => word[0].toUpperCase())
		.slice(0, 2)
		.join('')
}
