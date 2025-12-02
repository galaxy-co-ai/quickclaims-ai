import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
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
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
