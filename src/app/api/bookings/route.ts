import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { leadId, duration, description } = body

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Verify lead belongs to organization
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId: auth.organizationId as string,
      },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Generate unique booking link
    const bookingToken = crypto.randomBytes(16).toString('hex')
    const bookingLink = `${process.env.NEXT_PUBLIC_APP_URL}/book/${bookingToken}`

    const booking = await prisma.booking.create({
      data: {
        leadId,
        organizationId: auth.organizationId as string,
        bookingToken,
        bookingLink,
        duration: duration || 30,
        description,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking link' },
      { status: 500 }
    )
  }
}
