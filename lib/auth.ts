import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from './db'

/**
 * Get the authenticated user's ID for API routes
 * Returns the internal database user ID (not Clerk ID)
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId: clerkId } = await auth()
  
  if (!clerkId) {
    return null
  }

  // Find or create user in our database
  const user = await db.user.upsert({
    where: { clerkId },
    update: {}, // Don't update on existing - webhook handles that
    create: {
      clerkId,
      email: `${clerkId}@placeholder.com`, // Webhook will update with real email
      name: 'New User',
    },
    select: { id: true },
  })

  return user.id
}

/**
 * Get the authenticated user's ID or throw an error
 * Use this in protected API routes
 */
export async function requireAuthUserId(): Promise<string> {
  const userId = await getAuthUserId()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}

/**
 * Get full user data from Clerk and sync to database
 */
export async function getAuthUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    return null
  }

  // Upsert user with full data
  const user = await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@placeholder.com`,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
      avatarUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@placeholder.com`,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
      avatarUrl: clerkUser.imageUrl,
    },
  })

  return user
}
