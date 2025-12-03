import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

/**
 * GET /api/conversations/active
 * Get or create the active conversation for the current user
 */
export async function GET() {
  try {
    const userId = await requireAuthUserId()

    // Try to find an active conversation
    let conversation = await db.conversation.findFirst({
      where: { userId, isActive: true },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    // If no active conversation, create one
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId,
          title: 'New Conversation',
          isActive: true,
        },
        include: {
          messages: true,
        },
      })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to get active conversation' }, { status: 500 })
  }
}
