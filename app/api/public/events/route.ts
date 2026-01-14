import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Public API to fetch events for users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const upcoming = searchParams.get('upcoming')
    
    const where: any = { isActive: true }
    
    if (category) {
      where.category = category
    }
    
    if (upcoming === 'true') {
      where.startDate = { gte: new Date() }
    }
    
    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    })
    
    return NextResponse.json({ 
      success: true,
      events,
      count: events.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch events' 
    }, { status: 500 })
  }
}
