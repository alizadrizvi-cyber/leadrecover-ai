import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { createCheckoutSession, createOrRetrieveCustomer } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

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
    const { plan, billingCycle = 'monthly' } = body

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      )
    }

    // Get organization and user
    const organization = await prisma.organization.findUnique({
      where: { id: auth.organizationId as string },
      include: { subscription: true },
    })

    const user = await prisma.user.findUnique({
      where: { id: auth.userId as string },
    })

    if (!organization || !user) {
      return NextResponse.json(
        { error: 'Organization or user not found' },
        { status: 404 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId = organization.subscription?.stripeCustomerId
    if (!customerId || customerId.startsWith('temp-')) {
      customerId = await createOrRetrieveCustomer(
        organization.id,
        user.email,
        organization.name
      )
      
      // Update subscription with real customer ID
      if (organization.subscription) {
        await prisma.subscription.update({
          where: { id: organization.subscription.id },
          data: { stripeCustomerId: customerId },
        })
      }
    }

    // Create checkout session
    const session = await createCheckoutSession(
      organization.id,
      plan,
      customerId,
      user.email,
      billingCycle
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
