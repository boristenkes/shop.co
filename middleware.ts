import { NextRequest, NextResponse } from 'next/server'

export const config = {
	matcher: ['/((?!_next|favicon.ico|robots.txt).*)'] // run on almost everything
}

export function middleware(req: NextRequest) {
	const ua = req.headers.get('user-agent') || ''

	if (!ua || /bot|crawler|spider|scan|curl|wget|python|httpclient/i.test(ua)) {
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
