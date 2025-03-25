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
  // Get the auth cookie
  // const allCookies = request.cookies.getAll()
  // console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]
  const cookieHeader = request.headers.get('cookie') || '';

  const cookies = request.headers.get('fetch-access-token');

  console.log('cookies', cookieHeader)

  // const authToken = request.cookies.get('fetch-access-token')
  // console.log(' request.cookies',  authToken)

  // console.log('authToken', authToken)

  const path = request.nextUrl.pathname
  console.log('path', path)

  if (path !== '/login' && path !== 'home') {
    console.log('in hjer')

    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)

  }

  // // If there's no auth token and the user is trying to access a protected route
  // if (!authToken) {
  //   // Redirect to login page
  //   const loginUrl = new URL('/login', request.url)

  //   // Add the original destination as a redirect parameter
  //   loginUrl.searchParams.set('redirect', request.nextUrl.pathname)

  //   return NextResponse.redirect(loginUrl)
  // }

  // If auth token exists, allow the request to continue
  return NextResponse.next()
}
