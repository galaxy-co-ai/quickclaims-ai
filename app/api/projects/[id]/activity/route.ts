import { NextResponse } from 'next/server'
import { getActivityLog } from '@/lib/activity'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireAuthUserId()
    const { id: projectId } = await params

    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: { id: projectId, userId },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const entries = await getActivityLog(projectId, 50)
    return NextResponse.json({ activity: entries })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
