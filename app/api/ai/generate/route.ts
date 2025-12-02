import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProjectDocuments } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    // Get project data
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { uploads: true },
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Update status to analyzing
    await db.project.update({
      where: { id: projectId },
      data: { status: 'analyzing' },
    })
    
    // Find scope document if uploaded
    const scopeUpload = project.uploads.find(u => u.fileType === 'scope')
    let scopeContent = ''
    
    if (scopeUpload) {
      // TODO: Extract text from PDF/document
      scopeContent = 'Scope content would be extracted here'
    }
    
    // Generate documents using AI
    const generatedDocs = await generateProjectDocuments(
      {
        address: project.address,
        clientName: project.clientName,
        projectType: project.projectType,
      },
      scopeContent
    )
    
    // Save generated documents to database
    const documentTypes = ['roadmap', 'materials', 'estimate', 'brief'] as const
    
    for (const type of documentTypes) {
      if (generatedDocs[type]) {
        await db.document.create({
          data: {
            projectId,
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
            content: generatedDocs[type],
          },
        })
      }
    }
    
    // Update project status to ready
    await db.project.update({
      where: { id: projectId },
      data: { status: 'ready' },
    })
    
    return NextResponse.json({ success: true, documents: generatedDocs })
  } catch (error) {
    console.error('Error generating documents:', error)
    return NextResponse.json(
      { error: 'Failed to generate documents' },
      { status: 500 }
    )
  }
}
