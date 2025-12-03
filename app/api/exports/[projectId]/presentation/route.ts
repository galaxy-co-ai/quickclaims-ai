import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateProjectBrief, generateSupplementPresentation, isGammaConfigured } from '@/lib/ai/gamma'
import { requireAuthUserId } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ projectId: string }>
}

/**
 * Verify project belongs to user
 */
async function verifyProjectOwnership(projectId: string, userId: string) {
  return db.project.findFirst({
    where: { id: projectId, userId },
  })
}

/**
 * POST /api/exports/[projectId]/presentation
 * Generate a presentation using Gamma AI
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { projectId } = await params

    // Verify ownership
    const ownershipCheck = await verifyProjectOwnership(projectId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    const body = await request.json()
    const { type = 'brief' } = body as { type?: 'brief' | 'supplement' }

    // Check if Gamma is configured
    if (!isGammaConfigured()) {
      return NextResponse.json(
        { 
          error: 'Gamma API not configured', 
          message: 'Please add GAMMA_API_KEY to your environment variables' 
        },
        { status: 503 }
      )
    }

    // Get project data
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        documents: {
          where: { type: { in: ['roadmap', 'materials', 'estimate'] } },
          orderBy: { createdAt: 'desc' },
        },
        claim: {
          include: {
            deltas: {
              where: { status: { in: ['approved', 'included'] } },
            },
            carrierScopes: {
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    let result

    if (type === 'supplement' && project.claim) {
      // Generate supplement presentation
      const items = project.claim.deltas.map(d => ({
        description: d.description,
        xactimateCode: d.xactimateCode || undefined,
        rcv: d.estimatedRCV || undefined,
        defenseNote: d.defenseNote || undefined,
      }))

      result = await generateSupplementPresentation({
        insuredName: project.clientName,
        propertyAddress: project.address,
        claimNumber: project.claim.claimNumber || undefined,
        carrierName: project.claim.carrier || 'Insurance Carrier',
        items,
        totalAmount: project.claim.deltas.reduce((sum, d) => sum + (d.estimatedRCV || 0), 0),
        originalRCV: project.claim.carrierScopes[0]?.totalRCV || 0,
      })
    } else {
      // Generate project brief
      const roadmapDoc = project.documents.find(d => d.type === 'roadmap')
      const materialsDoc = project.documents.find(d => d.type === 'materials')
      const estimateDoc = project.documents.find(d => d.type === 'estimate')

      const roadmap = roadmapDoc?.content as { phases?: Array<{ name: string; tasks: string[]; durationDays: number }>; overview?: string } | null
      const materials = materialsDoc?.content as { items?: Array<{ name: string; quantity: number; unit: string }> } | null
      const estimate = estimateDoc?.content as { grandTotal?: number } | null

      result = await generateProjectBrief({
        clientName: project.clientName,
        address: project.address,
        projectType: project.projectType,
        overview: roadmap?.overview,
        phases: roadmap?.phases,
        materials: materials?.items,
        totalCost: estimate?.grandTotal,
      })
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate presentation', message: 'Gamma API returned no result' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      type,
      document: result,
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate presentation', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/exports/[projectId]/presentation
 * Check presentation generation status or get available options
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { projectId } = await params

    // Verify ownership
    const ownershipCheck = await verifyProjectOwnership(projectId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get project to check what's available
    const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      clientName: true,
      documents: { select: { type: true } },
      claim: { 
        select: { 
          id: true,
          deltas: { where: { status: 'approved' }, select: { id: true } }
        } 
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json({
    projectId,
    clientName: project.clientName,
    gammaConfigured: isGammaConfigured(),
    availableTypes: {
      brief: project.documents.length > 0,
      supplement: project.claim && project.claim.deltas.length > 0,
    },
  })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
