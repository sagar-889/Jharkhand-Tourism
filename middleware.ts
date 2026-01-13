import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get origin from request
  const origin = request.headers.get('origin')
  
  // Allowed origins - add your frontend URLs here
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://jharkhand-tourism.vercel.app',
    'https://jharkhand-tourism-li3w.onrender.com',
    // Add more frontend URLs as needed
  ]

  // Check if origin is allowed
  const isAllowed = origin && allowedOrigins.includes(origin)

  // Handle preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    })
  }

  // Handle actual requests
  const response = NextResponse.next()
  
  // Add CORS headers to response
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  }

  return response
}

// Apply middleware to API routes only
export const config = {
  matcher: '/api/:path*',
}
