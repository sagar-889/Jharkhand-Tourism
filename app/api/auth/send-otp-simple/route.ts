import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendOTPEmail } from '@/lib/mailer'

// Simple OTP sending without database (for testing)
export async function POST(request: NextRequest) {
  console.log('Simple Send OTP API called')
  try {
    const { email, type } = await request.json()
    console.log('Request data:', { email, type })
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log('Normalized email:', normalizedEmail)

    // Generate OTP
    const otp = generateOTP()
    console.log('Generated OTP:', otp)

    // Try to send email
    const otpSent = await sendOTPEmail(normalizedEmail, otp)
    
    if (otpSent) {
      // Store OTP in memory for testing (not production ready)
      if (typeof global !== 'undefined') {
        (global as any).testOTP = { 
          email: normalizedEmail, 
          otp, 
          expiry: Date.now() + 10 * 60 * 1000 
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email successfully',
        email: normalizedEmail,
        // For testing only - remove in production
        testOTP: otp
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
