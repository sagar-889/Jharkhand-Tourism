import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Public API to fetch restaurants for users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cuisineType = searchParams.get('cuisineType')
    const location = searchParams.get('location')
    
    const where: any = { isActive: true }
    
    if (cuisineType) {
      where.cuisineType = { has: cuisineType }
    }
    
    if (location) {
      where.address = { contains: location, mode: 'insensitive' }
    }
    
    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ 
      success: true,
      restaurants,
      count: restaurants.length 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch restaurants' 
    }, { status: 500 })
  }
}
