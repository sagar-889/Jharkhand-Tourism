import { NextResponse } from 'next/server'

/**
 * Health check endpoint
 * Used to verify the backend is running and accessible
 */
export async function GET() {
  try {
    // You can add more checks here (database connection, etc.)
    return NextResponse.json({
      status: 'ok',
      message: 'Jharkhand Tourism API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
