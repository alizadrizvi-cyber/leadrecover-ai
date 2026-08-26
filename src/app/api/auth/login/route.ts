import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword } from '@/lib/auth'
import { createToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get user's organizations
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      )
    }

    const token = await createToken(user.id, membership.organization.id)

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

import { prisma } from '@/lib/prisma'
