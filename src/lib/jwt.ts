import { prisma } from './prisma'
import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key'
)

export async function createToken(userId: string, organizationId: string) {
  return new SignJWT({ userId, organizationId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export async function getSessionUser(token?: string) {
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
  })

  return user
}

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return { error: 'Unauthorized', status: 401 }
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return { error: 'Invalid token', status: 401 }
  }

  return { userId: payload.userId, organizationId: payload.organizationId }
}
