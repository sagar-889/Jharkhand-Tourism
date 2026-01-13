import { NextResponse } from 'next/server'

// Diagnostic endpoint to check environment variables (remove in production)
export async function GET() {
  return NextResponse.json({
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPassword: !!process.env.EMAIL_PASSWORD,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    emailUserPrefix: process.env.EMAIL_USER?.substring(0, 5) + '***',
  })
}
