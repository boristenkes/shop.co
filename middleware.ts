import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './lib/rate-limit'

export const config = {
	matcher: ['/((?!_next|favicon.ico|robots.txt).*)']
}

const botRegex =
	/bot|crawler|spider|scan|curl|wget|python|httpclient|gptbot|headless/i

export function middleware(req: NextRequest) {
	const userAgent = req.headers.get('user-agent') || ''
	const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'unknown'

	if (!userAgent || botRegex.test(userAgent)) {
		return new NextResponse('Forbidden', { status: 403 })
	}

	const rl = rateLimit(ip)

	if (rl === 'too-many') {
		return new NextResponse('Too many requests', { status: 429 })
	}

	const protectedRoutes = [
		'/dashboard',
		'/reviews',
		'/orders',
		'/profile',
		'/checkout'
	]

	const isProtected = protectedRoutes.some(path =>
		req.nextUrl.pathname.startsWith(path)
	)

	if (isProtected) {
		const sessionToken =
			req.cookies.get('__Secure-authjs.session-token') ||
			req.cookies.get('authjs.session-token')

		if (!sessionToken) {
			return NextResponse.redirect(new URL('/', req.url))
		}
	}

	return NextResponse.next()
}
