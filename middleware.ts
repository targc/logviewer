import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  const authUser = process.env.BASIC_AUTH_USER || 'admin'
  const authPass = process.env.BASIC_AUTH_PASS || 'admin123'

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === authUser && pwd === authPass) {
      return NextResponse.next()
    }
  }

  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api/auth).*)'],
}
