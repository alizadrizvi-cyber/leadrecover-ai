import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const leads = await prisma.lead.findMany({
      where: { organizationId: auth.organizationId as string },
      include: {
        conversations: true,
        booking: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

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
    const { firstName, lastName, email, phone, source, serviceRequested } = body

    if (!firstName) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId: auth.organizationId as string,
        firstName,
        lastName,
        email,
        phone,
        source,
        serviceRequested,
        status: 'new',
      },
    })

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        organizationId: auth.organizationId as string,
        eventType: 'lead_created',
        metadata: {
          leadId: lead.id,
          source,
        },
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
