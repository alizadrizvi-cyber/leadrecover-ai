import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth - LeadRecover AI',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
