import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { db } from '@/lib/db'
import { requireAuthUserId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await requireAuthUserId()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const fileType = formData.get('fileType') as string
    
    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and projectId are required' },
        { status: 400 }
      )
    }
    
    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: { id: projectId, userId },
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }
    
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    })
    
    // Save to database
    const upload = await db.upload.create({
      data: {
        projectId,
        fileName: file.name,
        fileUrl: blob.url,
        fileType: fileType || 'document',
        mimeType: file.type,
        fileSize: file.size,
      },
    })
    
    return NextResponse.json(upload, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
