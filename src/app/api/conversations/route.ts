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

    const conversations = await prisma.conversation.findMany({
      where: { organizationId: auth.organizationId as string },
      include: {
        lead: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
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
    const { leadId, channel, subject } = body

    if (!leadId || !channel) {
      return NextResponse.json(
        { error: 'Lead ID and channel are required' },
        { status: 400 }
      )
    }

    // Check if lead exists
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

    const conversation = await prisma.conversation.create({
      data: {
        organizationId: auth.organizationId as string,
        leadId,
        channel,
        subject,
      },
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
