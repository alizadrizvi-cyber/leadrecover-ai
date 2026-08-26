import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature') || ''

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Find organization by metadata
        const org = await prisma.organization.findFirst({
          where: {
            subscription: {
              stripeCustomerId: subscription.customer as string,
            },
          },
        })

        if (org) {
          const plan = subscription.metadata?.plan || 'free'
          const status = subscription.status
          
          await prisma.subscription.update({
            where: { organizationId: org.id },
            data: {
              stripeSubscriptionId: subscription.id,
              plan,
              status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              trialEnd: subscription.trial_end 
                ? new Date(subscription.trial_end * 1000)
                : null,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        const org = await prisma.organization.findFirst({
          where: {
            subscription: {
              stripeCustomerId: subscription.customer as string,
            },
          },
        })

        if (org) {
          await prisma.subscription.update({
            where: { organizationId: org.id },
            data: {
              status: 'canceled',
              plan: 'free',
              canceledAt: new Date(),
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        
        // Create payment record
        if (invoice.subscription) {
          const org = await prisma.organization.findFirst({
            where: {
              subscription: {
                stripeSubscriptionId: invoice.subscription as string,
              },
            },
          })

          if (org) {
            await prisma.payment.create({
              data: {
                subscriptionId: org.subscription!.id,
                stripePaymentIntentId: invoice.payment_intent as string,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency.toUpperCase(),
                status: 'succeeded',
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        
        if (invoice.subscription) {
          const org = await prisma.organization.findFirst({
            where: {
              subscription: {
                stripeSubscriptionId: invoice.subscription as string,
              },
            },
          })

          if (org) {
            await prisma.subscription.update({
              where: { organizationId: org.id },
              data: { status: 'past_due' },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
