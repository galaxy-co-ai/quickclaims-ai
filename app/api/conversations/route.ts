import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

/**
 * GET /api/conversations
 * List all conversations for the current user
 */
export async function GET() {
  try {
    const userId = await requireAuthUserId()

    const conversations = await db.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { messages: true },
        },
      },
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

/**
 * POST /api/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuthUserId()
    const body = await request.json()
    const { title } = body as { title?: string }

    // Deactivate any currently active conversation
    await db.conversation.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    })

    // Create new active conversation
    const conversation = await db.conversation.create({
      data: {
        userId,
        title: title || 'New Conversation',
        isActive: true,
      },
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
