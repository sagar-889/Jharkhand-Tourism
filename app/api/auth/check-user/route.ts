import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, mobile } = await request.json()

    if (!email && !mobile) {
      return NextResponse.json(
        { error: 'Email or mobile is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email?.toLowerCase().trim()

    // Check if user exists with email or mobile
    const query: any = {}
    if (normalizedEmail) {
      query.email = normalizedEmail
    }
    if (mobile) {
      query.mobile = mobile
    }

    // Use $or to check if either email or mobile exists
    const existingUser = await User.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(mobile ? [{ mobile: mobile }] : [])
      ]
    })

    if (existingUser) {
      let message = 'User already exists'
      if (existingUser.email === normalizedEmail && existingUser.mobile === mobile) {
        message = 'User already exists with this email and mobile number'
      } else if (existingUser.email === normalizedEmail) {
        message = 'User already exists with this email address'
      } else if (existingUser.mobile === mobile) {
        message = 'User already exists with this mobile number'
      }

      return NextResponse.json({
        exists: true,
        message
      })
    }

    return NextResponse.json({
      exists: false,
      message: 'User does not exist'
    })

  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
