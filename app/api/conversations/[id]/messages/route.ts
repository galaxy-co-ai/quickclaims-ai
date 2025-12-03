import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/conversations/[id]/messages
 * Add a message to a conversation
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id: conversationId } = await params
    const body = await request.json()
    const { role, content, toolsUsed, actions, attachments } = body as {
      role: 'user' | 'assistant'
      content: string
      toolsUsed?: unknown[]
      actions?: unknown[]
      attachments?: unknown[]
    }

    // Verify conversation ownership
    const conversation = await db.conversation.findFirst({
      where: { id: conversationId, userId },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Create the message
    const message = await db.chatMessage.create({
      data: {
        conversationId,
        role,
        content,
        toolsUsed: toolsUsed ? JSON.parse(JSON.stringify(toolsUsed)) : undefined,
        actions: actions ? JSON.parse(JSON.stringify(actions)) : undefined,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : undefined,
      },
    })

    // Update conversation title from first user message if still "New Conversation"
    if (conversation.title === 'New Conversation' && role === 'user') {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
      await db.conversation.update({
        where: { id: conversationId },
        data: { title, updatedAt: new Date() },
      })
    } else {
      // Just update the timestamp
      await db.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
  }
}
