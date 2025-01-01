import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const rateLimit = 200 // requests per hour
const rateLimitPeriod = 60 * 60 * 1000 // 1 hour in milliseconds

// In-memory store for rate limiting
// Note: In production with multiple instances, use Redis or similar
const ipRequests = new Map()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.timestamp > rateLimitPeriod) {
      ipRequests.delete(ip)
    }
  }
}, rateLimitPeriod)

export async function middleware(request) {
  // Skip rate limiting for static files and favicon
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname === '/favicon.ico' ||
    request.nextUrl.pathname === '/roadmap'
  ) {
    return NextResponse.next()
  }

  const ip = request.ip ?? 'anonymous'
  const now = Date.now()

  let requestData = ipRequests.get(ip)
  if (!requestData) {
    requestData = {
      count: 0,
      timestamp: now,
    }
    ipRequests.set(ip, requestData)
  }

  // Reset count if outside rate limit period
  if (now - requestData.timestamp > rateLimitPeriod) {
    requestData.count = 0
    requestData.timestamp = now
  }

  requestData.count++

  const response = NextResponse.next()

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(rateLimit))
  response.headers.set(
    'X-RateLimit-Remaining',
    String(Math.max(0, rateLimit - requestData.count))
  )
  response.headers.set(
    'X-RateLimit-Reset',
    String(requestData.timestamp + rateLimitPeriod)
  )

  // If rate limit exceeded, return 429 Too Many Requests
  if (requestData.count > rateLimit) {
    // For API routes, return JSON response
    if (request.nextUrl.pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again in an hour.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(rateLimit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(requestData.timestamp + rateLimitPeriod),
            'Retry-After': String(Math.ceil((requestData.timestamp + rateLimitPeriod - now) / 1000)),
          },
        }
      )
    }

    // For regular routes, redirect to error page
    return NextResponse.rewrite(new URL('/error', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (auth routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    '/((?!api/auth|_next/static|_next/image|static|favicon.ico|sitemap.xml).*)',
  ],
}
