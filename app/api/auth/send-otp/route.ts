import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'
import { generateOTP, sendOTPEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  console.log('Send OTP API called')
  try {
    await dbConnect()
    console.log('Database connected')

    const { email, type } = await request.json()
    console.log('Request data:', { email, type })

    if (!email) {
      console.log('Email missing')
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

    if (type === 'signup') {
      // Check if user already exists
      const existingUser = await (User as any).findOne({ email: normalizedEmail }) as IUser | null
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
    } else if (type === 'login') {
      // Check if user exists
      const existingUser = await (User as any).findOne({ email: normalizedEmail }) as IUser | null
      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        )
      }
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    if (type === 'login') {
      await (User as any).updateOne(
        { email: normalizedEmail },
        { otp, otpExpiry }
      )
    } else if (type === 'signup') {
      // For signup, we'll store it temporarily (will be saved with user creation)
      // We'll pass it back to the client to store temporarily
    }

    // Send OTP via email
    const emailSent = await sendOTPEmail(normalizedEmail, otp)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email successfully',
      email: normalizedEmail,
      // For signup, we need to pass OTP back (or store in session/temp storage)
      ...(type === 'signup' && { tempOtp: otp, tempOtpExpiry: otpExpiry.toISOString() })
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
