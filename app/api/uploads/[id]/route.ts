import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { del } from '@vercel/blob'

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { fileName } = await request.json()
    if (!fileName) return NextResponse.json({ error: 'fileName required' }, { status: 400 })

    const updated = await db.upload.update({ where: { id: params.id }, data: { fileName } })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to rename upload' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const upload = await db.upload.findUnique({ where: { id: params.id } })
    if (!upload) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Delete blob (best-effort)
    try { await del(upload.fileUrl) } catch {}

    await db.upload.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 })
  }
}
