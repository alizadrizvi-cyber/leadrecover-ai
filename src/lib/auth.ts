import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, name: string, password: string, industry: string) {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  // Create default organization
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const organization = await prisma.organization.create({
    data: {
      name,
      slug: `${slug}-${Date.now()}`,
      industry,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
      subscription: {
        create: {
          stripeCustomerId: `temp-${user.id}`,
          plan: 'free',
          status: 'trialing',
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
        },
      },
      aiSettings: {
        create: {
          personality: 'professional',
        },
      },
    },
  })

  return { user, organization }
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserOrganizations(userId: string) {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: { organization: true },
  })

  return memberships.map((m) => m.organization)
}

export async function getUserOrganizationsBySlug(userId: string, slug: string) {
  return prisma.organization.findFirst({
    where: {
      slug,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
      subscription: true,
      aiSettings: true,
    },
  })
}
