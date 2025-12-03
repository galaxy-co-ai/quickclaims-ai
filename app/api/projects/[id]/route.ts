import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const UpdateProjectSchema = z.object({
  clientName: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  projectType: z.string().min(1).optional(),
  status: z.enum(['created', 'analyzing', 'ready', 'in-progress', 'completed']).optional(),
})

/**
 * GET /api/projects/[id]
 * Get a single project
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params

    const project = await db.project.findFirst({
      where: { id, userId },
      include: {
        uploads: { orderBy: { createdAt: 'desc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        claim: true,
        _count: { select: { uploads: true, documents: true } },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

/**
 * PATCH /api/projects/[id]
 * Update a project
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validationResult = UpdateProjectSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = await db.project.update({
      where: { id },
      data: validationResult.data,
    })

    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { id } = await params

    // Verify ownership
    const existing = await db.project.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await db.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
