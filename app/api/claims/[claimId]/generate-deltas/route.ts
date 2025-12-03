import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateDeltas, PhotoAnalysisResult, generateDefenseNote } from '@/lib/claims/photo-analysis'
import { requireAuthUserId } from '@/lib/auth'

/**
 * Verify claim belongs to user
 */
async function verifyClaimOwnership(claimId: string, userId: string) {
  return db.claim.findFirst({
    where: { id: claimId, project: { userId } },
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params

    // Verify ownership
    const ownershipCheck = await verifyClaimOwnership(claimId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    // Get claim with all related data
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        carrierScopes: {
          orderBy: { version: 'desc' },
          take: 1,
          include: { lineItems: true }
        },
        photoAnalyses: {
          where: { analysisStatus: 'completed' }
        },
        deltas: true,
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const latestScope = claim.carrierScopes[0]
    if (!latestScope) {
      return NextResponse.json({ 
        error: 'No carrier scope uploaded yet. Please upload a carrier scope first.' 
      }, { status: 400 })
    }

    // Convert photo analyses to the expected format
    const photoAnalysisResults: PhotoAnalysisResult[] = claim.photoAnalyses
      .filter(pa => pa.rawAnalysis)
      .map(pa => pa.rawAnalysis as unknown as PhotoAnalysisResult)

    // Generate deltas
    const scopeLineItems = latestScope.lineItems.map(item => ({
      xactimateCode: item.xactimateCode,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
    }))

    const generatedDeltas = await generateDeltas(scopeLineItems, photoAnalysisResults)

    // Clear existing non-approved deltas
    await db.deltaItem.deleteMany({
      where: {
        claimId,
        status: 'identified', // Only delete ones that haven't been reviewed
      }
    })

    // Create new deltas
    const createdDeltas = await Promise.all(
      generatedDeltas.map(async (delta) => {
        // Generate full defense note
        const fullDefenseNote = delta.defenseNote || generateDefenseNote(delta)
        
        return db.deltaItem.create({
          data: {
            claimId,
            deltaType: delta.deltaType,
            xactimateCode: delta.xactimateCode,
            description: delta.description,
            category: delta.category,
            ircCode: delta.ircCode,
            defenseNote: fullDefenseNote,
            quantity: delta.quantity,
            unit: delta.unit,
            estimatedRCV: delta.estimatedRCV,
            photoAnalysisId: delta.photoAnalysisId,
            evidenceNotes: delta.evidenceNotes,
            status: 'identified',
          }
        })
      })
    )

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'deltas_generated',
        description: `Delta analysis completed: ${createdDeltas.length} potential supplement items identified`,
        details: {
          deltaCount: createdDeltas.length,
          deltaTypes: generatedDeltas.reduce((acc, d) => {
            acc[d.deltaType] = (acc[d.deltaType] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          photoAnalysesUsed: claim.photoAnalyses.length,
        }
      }
    })

    // Update claim status if not already past delta_analysis
    const statusOrder = ['intake', 'scope_review', 'delta_analysis']
    if (statusOrder.includes(claim.status)) {
      await db.claim.update({
        where: { id: claimId },
        data: { status: 'delta_analysis' }
      })
    }

    return NextResponse.json({
      deltas: createdDeltas,
      summary: {
        total: createdDeltas.length,
        missing: createdDeltas.filter(d => d.deltaType === 'missing').length,
        recommended: createdDeltas.filter(d => d.deltaType === 'recommend_add').length,
        photoAnalysesUsed: claim.photoAnalyses.length,
      }
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET deltas for a claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params

    // Verify ownership
    const ownershipCheck = await verifyClaimOwnership(claimId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const deltas = await db.deltaItem.findMany({
      where: { claimId },
      orderBy: [
        { status: 'asc' }, // identified first
        { deltaType: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        photoAnalysis: {
          select: {
            id: true,
            photoType: true,
            location: true,
            uploadId: true,
          }
        }
      }
    })

    // Calculate summary stats
    const summary = {
      total: deltas.length,
      byType: deltas.reduce((acc, d) => {
        acc[d.deltaType] = (acc[d.deltaType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byStatus: deltas.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      estimatedTotalRCV: deltas.reduce((sum, d) => sum + (d.estimatedRCV || 0), 0),
    }

    return NextResponse.json({ deltas, summary })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
