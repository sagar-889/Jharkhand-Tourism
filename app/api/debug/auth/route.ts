import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    const response: any = {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      nodeEnv: process.env.NODE_ENV
    }

    if (token) {
      const decoded = verifyToken(token)
      response.tokenValid = !!decoded
      if (decoded) {
        response.userId = decoded.userId
        response.role = decoded.role
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
