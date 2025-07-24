export function formatFileSize(sizeInBytes: number) {
	if (sizeInBytes === 0) return '0 Bytes'

	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
	const formattedSize = parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2))

	return `${formattedSize} ${units[i]}`
}

export const intFormatter = new Intl.NumberFormat('en-US', {
	style: 'decimal'
})

export const priceFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	notation: 'standard'
})

export function formatPrice(priceInCents: number | string) {
	return priceFormatter.format(Number(priceInCents) / 100)
}

export function formatId(id: string | number) {
	return '#' + id.toString().padStart(5, '0')
}

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
})

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: '2-digit',
	year: 'numeric'
})

export function limitTextLength(text: string, limit: number) {
	return text.length > limit ? text.slice(0, limit) : text
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
