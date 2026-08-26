import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    leads: 5,
    features: ['Basic AI responses', 'Email only'],
  },
  starter: {
    name: 'Starter',
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    leads: 100,
    features: [
      'AI Lead Follow-up',
      'Email & SMS',
      'Lead Qualification',
      'Basic Analytics',
    ],
  },
  growth: {
    name: 'Growth',
    price: 97,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID,
    leads: 500,
    features: [
      'AI Lead Follow-up',
      'Email, SMS, Instagram, Facebook',
      'Advanced Lead Qualification',
      'Smart Follow-up Sequences',
      'Booking Links',
      'Advanced Analytics',
      'Team Collaboration',
    ],
    recommended: true,
  },
  pro: {
    name: 'Pro',
    price: 197,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    leads: 2000,
    features: [
      'Everything in Growth',
      'Custom Integrations',
      'Priority Support',
      'Advanced AI Customization',
      'Webhook Access',
      'API Access',
    ],
  },
}

export async function createCheckoutSession(
  organizationId: string,
  plan: 'starter' | 'growth' | 'pro',
  customerId: string,
  email: string,
  billingCycle: 'monthly' | 'annual' = 'monthly'
) {
  const priceId = PLANS[plan].priceId
  if (!priceId) throw new Error(`Invalid plan: ${plan}`)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: billingCycle === 'annual' ? priceId.replace('monthly', 'annual') : priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      organizationId,
      plan,
    },
  })

  return session
}

export async function createOrRetrieveCustomer(
  organizationId: string,
  email: string,
  name: string
) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (customers.data.length > 0) {
    return customers.data[0].id
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId,
    },
  })

  return customer.id
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscriptionPrice(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
  })
}
