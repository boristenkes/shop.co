export type RateLimitResult = 'ok' | 'blocked' | 'too-many'

type Data = {
	count: number
	last: number
}

const ipStore = new Map<string, Data>()

export const MAX_REQUESTS = 30
export const WINDOW_MS = 60 * 1000 // 1min

export function rateLimit(ip: string): RateLimitResult {
	const now = Date.now()
	const record = ipStore.get(ip) || { count: 0, last: now }

	if (now - record.last > WINDOW_MS) {
		record.count = 1
		record.last = now
	} else {
		record.count++
	}

	ipStore.set(ip, record)

	if (record.count > MAX_REQUESTS) return 'too-many'

	return 'ok'
}
