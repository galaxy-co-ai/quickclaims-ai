import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAuthUserId } from '@/lib/auth'

/**
 * POST /api/ai/upload
 * Upload files for the AI chat - these are temporary uploads for AI context
 * Returns URLs that can be sent to the AI for analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    await requireAuthUserId()
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles: Array<{
      name: string
      url: string
      type: string
      size: number
    }> = []

    // Upload each file to Vercel Blob
    for (const file of files) {
      const blob = await put(`ai-chat/${Date.now()}-${file.name}`, file, {
        access: 'public',
      })
      
      uploadedFiles.push({
        name: file.name,
        url: blob.url,
        type: file.type,
        size: file.size,
      })
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
