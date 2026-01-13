import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendOTPEmail } from '@/lib/mailer'
import dbConnect from '@/lib/mongodb'
import OTP from '@/lib/models/OTP'

// OTP sending with database storage
export async function POST(request: NextRequest) {
  console.log('Send OTP API called')
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

    // Connect to database
    await dbConnect()

    // Generate OTP
    const otp = generateOTP()
    console.log('Generated OTP:', otp)

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail })

    // Store OTP in database
    await OTP.create({
      email: normalizedEmail,
      otp,
      type: type || 'login',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    })

    // Try to send email
    const otpSent = await sendOTPEmail(normalizedEmail, otp)
    
    if (otpSent) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email successfully',
        email: normalizedEmail,
      })
    } else {
      // Delete OTP if email failed to send
      await OTP.deleteMany({ email: normalizedEmail })
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send OTP error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for common issues
      if (error.message.includes('Email credentials not configured')) {
        errorMessage = 'Email service not configured. Please contact administrator.'
      } else if (error.message.includes('EAUTH') || error.message.includes('Invalid login')) {
        errorMessage = 'Email authentication failed. Please contact administrator.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
