import { NextRequest, NextResponse } from 'next/server'

export const config = {
	matcher: ['/((?!_next|favicon.ico|robots.txt).*)']
}

export function middleware(req: NextRequest) {
	const ua = req.headers.get('user-agent') || ''
	const accept = req.headers.get('accept') || ''

	const isBot =
		!ua ||
		!accept.includes('text/html') ||
		/bot|crawler|spider|scan|curl|wget|python|httpclient|gptbot|headless/i.test(
			ua
		)

	if (isBot) {
		return new NextResponse('Forbidden', { status: 403 })
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
