import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const TEMP_USER_ID = process.env.TEMP_USER_ID || 'dev-user-001'

/**
 * GET /api/documents
 * Fetch all documents and uploads across all projects for the current user
 */
export async function GET() {
  try {
    // Get all AI-generated documents
    const documents = await db.document.findMany({
      where: {
        project: {
          userId: TEMP_USER_ID,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            clientName: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get all uploads (scopes, photos, other files)
    const uploads = await db.upload.findMany({
      where: {
        project: {
          userId: TEMP_USER_ID,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            clientName: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to unified format
    const allDocuments = [
      // AI-generated documents
      ...documents.map((doc) => ({
        id: doc.id,
        name: `${doc.title || doc.type}.json`,
        type: 'application/json',
        category: mapDocTypeToCategory(doc.type),
        projectId: doc.projectId,
        projectName: doc.project.clientName,
        size: JSON.stringify(doc.content).length,
        createdAt: doc.createdAt.toISOString(),
        aiTags: getAITags(doc.type, doc.content),
        aiConfidence: 0.95, // AI-generated docs have high confidence
        url: null,
        isGenerated: true,
        docType: doc.type,
      })),
      // Uploaded files
      ...uploads.map((upload) => {
        // Use stored AI tags if available, otherwise infer from filename
        const hasAIAnalysis = upload.tags && upload.tags.length > 0
        return {
          id: upload.id,
          name: upload.fileName,
          type: upload.mimeType,
          category: upload.category || mapFileTypeToCategory(upload.fileType, upload.mimeType, upload.fileName),
          projectId: upload.projectId,
          projectName: upload.project.clientName,
          size: upload.fileSize,
          createdAt: upload.createdAt.toISOString(),
          aiTags: hasAIAnalysis ? upload.tags : inferTags(upload.fileName, upload.fileType),
          aiConfidence: hasAIAnalysis ? 0.95 : 0.75, // AI-analyzed files have higher confidence
          url: upload.fileUrl,
          isGenerated: false,
          docType: upload.fileType,
          description: upload.description,
          aiAnalyzed: !!upload.aiAnalyzedAt,
        }
      }),
    ]

    // Sort by date
    allDocuments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ 
      documents: allDocuments,
      counts: {
        total: allDocuments.length,
        generated: documents.length,
        uploaded: uploads.length,
      }
    })
  } catch (error) {
    // Use a proper error logging approach instead of console.error in production
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch documents', details: errorMessage },
      { status: 500 }
    )
  }
}

// Map AI document types to UI categories
function mapDocTypeToCategory(docType: string): string {
  const mapping: Record<string, string> = {
    roadmap: 'report',
    materials: 'estimate',
    estimate: 'estimate',
    brief: 'report',
  }
  return mapping[docType] || 'other'
}

// Map uploaded file types to UI categories
function mapFileTypeToCategory(fileType: string, mimeType: string, fileName: string): string {
  if (mimeType.startsWith('image/')) return 'photo'
  
  const lowerName = fileName.toLowerCase()
  if (fileType === 'scope' || lowerName.includes('scope') || lowerName.includes('sol')) return 'scope'
  if (lowerName.includes('estimate') || lowerName.includes('quote')) return 'estimate'
  if (lowerName.includes('contract') || lowerName.includes('agreement')) return 'contract'
  if (lowerName.includes('invoice') || lowerName.includes('receipt')) return 'invoice'
  if (lowerName.includes('report')) return 'report'
  
  return 'other'
}

// Get tags for AI-generated documents based on type and content
function getAITags(docType: string, content: unknown): string[] {
  const tags: string[] = ['ai-generated']
  
  switch (docType) {
    case 'roadmap':
      tags.push('project-plan', 'timeline')
      break
    case 'materials':
      tags.push('materials-list', 'pricing')
      break
    case 'estimate':
      tags.push('cost-estimate', 'labor', 'materials')
      break
    case 'brief':
      tags.push('summary', 'overview')
      break
  }
  
  return tags
}

// Infer tags from filename and type for uploaded files
function inferTags(fileName: string, fileType: string): string[] {
  const tags: string[] = []
  const lowerName = fileName.toLowerCase()
  
  // File type tags
  if (fileType === 'scope') tags.push('carrier-scope')
  if (fileType === 'photo') tags.push('photo-evidence')
  
  // Content inference from filename
  if (lowerName.includes('damage')) tags.push('damage')
  if (lowerName.includes('roof')) tags.push('roofing')
  if (lowerName.includes('before')) tags.push('before')
  if (lowerName.includes('after')) tags.push('after')
  if (lowerName.includes('hail')) tags.push('hail-damage')
  if (lowerName.includes('wind')) tags.push('wind-damage')
  if (lowerName.includes('state') || lowerName.includes('farm')) tags.push('state-farm')
  if (lowerName.includes('allstate')) tags.push('allstate')
  if (lowerName.includes('usaa')) tags.push('usaa')
  if (lowerName.includes('liberty')) tags.push('liberty-mutual')
  
  // Add upload tag if no other tags
  if (tags.length === 0) tags.push('uploaded')
  
  return tags
}
