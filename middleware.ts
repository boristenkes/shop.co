import { NextRequest, NextResponse } from 'next/server'

export const config = {
	matcher: ['/dashboard/:path*']
}

export function middleware(req: NextRequest) {
	const sessionToken =
		req.cookies.get('__Secure-authjs.session-token') ||
		req.cookies.get('authjs.session-token')

	if (!sessionToken) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	return NextResponse.next()
}
