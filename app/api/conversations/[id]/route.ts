import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/conversations/[id]
 * Get a single conversation with all messages
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params

    const conversation = await db.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}

/**
 * PATCH /api/conversations/[id]
 * Update a conversation (set active, update title)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params
    const body = await request.json()
    const { title, isActive } = body as { title?: string; isActive?: boolean }

    // Verify ownership
    const existing = await db.conversation.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // If setting this conversation as active, deactivate others
    if (isActive) {
      await db.conversation.updateMany({
        where: { userId, isActive: true, id: { not: id } },
        data: { isActive: false },
      })
    }

    const conversation = await db.conversation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 })
  }
}

/**
 * DELETE /api/conversations/[id]
 * Delete a conversation
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params

    // Verify ownership
    const existing = await db.conversation.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    await db.conversation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
}
