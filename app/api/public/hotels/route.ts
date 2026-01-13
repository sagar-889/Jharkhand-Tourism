import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public API to fetch hotels for users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    
    const where: any = { isActive: true }
    
    if (type) {
      where.type = type
    }
    
    if (location) {
      where.address = { contains: location, mode: 'insensitive' }
    }
    
    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ 
      success: true,
      hotels,
      count: hotels.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch hotels' 
    }, { status: 500 })
  }
}
