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

    const user = await prisma.user.findUnique({
      where: { id: auth.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const organization = await prisma.organization.findUnique({
      where: { id: auth.organizationId as string },
      include: { subscription: true },
    })

    return NextResponse.json({
      user,
      organization,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
