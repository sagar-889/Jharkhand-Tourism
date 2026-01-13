import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public API to fetch places for users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    const places = await prisma.place.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ 
      success: true,
      places,
      count: places.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching places:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch places' 
    }, { status: 500 })
  }
}
