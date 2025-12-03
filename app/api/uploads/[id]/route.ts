import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { del } from '@vercel/blob'
import { requireAuthUserId } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireAuthUserId()
    const { id: uploadId } = await params
    const { fileName } = await request.json()
    if (!fileName) return NextResponse.json({ error: 'fileName required' }, { status: 400 })

    // Verify upload belongs to user's project
    const upload = await db.upload.findFirst({
      where: { id: uploadId, project: { userId } },
    })
    if (!upload) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await db.upload.update({ where: { id: uploadId }, data: { fileName } })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to rename upload' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireAuthUserId()
    const { id: uploadId } = await params

    // Verify upload belongs to user's project
    const upload = await db.upload.findFirst({
      where: { id: uploadId, project: { userId } },
    })
    if (!upload) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Delete blob (best-effort)
    try { await del(upload.fileUrl) } catch {}

    await db.upload.delete({ where: { id: uploadId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 })
  }
}
