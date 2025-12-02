import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProjectDocuments } from '@/lib/ai/openai'
import { cacheGet, cacheSet, sha256, redis } from '@/lib/cache'
import { ingestScope, searchScope } from '@/lib/vector'
import { typeGuidance } from '@/lib/ai/guidance'

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

    // Prepare cache key
    const baseString = `${project.clientName}|${project.address}|${project.projectType}`
    let scopeDigest = ''

    // Find scope document if uploaded
    const scopeUpload = project.uploads.find(u => u.fileType === 'scope')
    let scopeContent = ''

    if (scopeUpload) {
      try {
        const { extractScopeText } = await import('@/lib/extract/scope')
        const text = await extractScopeText(scopeUpload.fileUrl, scopeUpload.mimeType)
        scopeDigest = sha256(text)
        // Ingest to vector if digest changed
        const digestKey = `project:${projectId}:scope_hash`
        const prev = (await cacheGet<string>(digestKey)) || ''
        if (prev !== scopeDigest) {
          await ingestScope(projectId, text)
          await cacheSet(digestKey, scopeDigest, 60 * 60 * 24)
        }
        // Trim to keep prompt size manageable
        scopeContent = text.slice(0, 20000)
      } catch (e) {
        console.error('Scope extraction failed:', e)
      }
    }

    // Retrieval context from vector index (best-effort)
    let retrievalContext = ''
    try {
      const query = `${project.projectType} at ${project.address}: tasks materials estimate`
      const results = await searchScope(projectId, query, 8)
      if (results?.length) {
        retrievalContext = results.map(r => r.chunk).join('\n---\n')
      }
    } catch (e) {
      console.error('Vector search failed:', e)
    }

    // Cache check
    const cacheKey = `ai:gen:v1:${projectId}:${sha256(baseString + '|' + scopeDigest)}`
    const cached = await cacheGet<any>(cacheKey)
    if (cached) {
      // ensure documents exist in DB as well (idempotent write skipped for brevity)
      await db.project.update({ where: { id: projectId }, data: { status: 'ready' } })
      return NextResponse.json({ success: true, documents: cached })
    }

    // Generate documents using AI with guidance and retrieval
    const generatedDocs = await generateProjectDocuments(
      {
        address: project.address,
        clientName: project.clientName,
        projectType: project.projectType,
      },
      scopeContent,
      retrievalContext,
      typeGuidance(project.projectType)
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

    // Cache result
    await cacheSet(cacheKey, generatedDocs, 60 * 60 * 24)
    
    return NextResponse.json({ success: true, documents: generatedDocs })
  } catch (error) {
    console.error('Error generating documents:', error)
    return NextResponse.json(
      { error: 'Failed to generate documents' },
      { status: 500 }
    )
  }
}
