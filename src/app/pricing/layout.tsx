import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - LeadRecover AI',
  description: 'Choose the perfect plan for recovering your lost leads.',
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
