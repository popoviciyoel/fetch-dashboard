import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes should be protected
export const config = {
  matcher: [
    '/',
    // Add other protected routes here
  ]
}

export function middleware(request: NextRequest) {


  const path = request.nextUrl.pathname
  if (path !== '/login' && path !== 'search') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)

  }

  return NextResponse.next()
}
