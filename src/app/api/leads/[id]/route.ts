import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: params.id,
        organizationId: auth.organizationId as string,
      },
      include: {
        conversations: {
          include: { messages: true },
        },
        booking: true,
        notes: true,
        tags: true,
      },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Get lead error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    const { status, leadScore, estimatedValue, firstName, lastName, email, phone } = body

    const lead = await prisma.lead.update({
      where: {
        id: params.id,
      },
      data: {
        ...(status && { status }),
        ...(leadScore !== undefined && { leadScore }),
        ...(estimatedValue !== undefined && { estimatedValue }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Update lead error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    await prisma.lead.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Lead deleted' })
  } catch (error) {
    console.error('Delete lead error:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
