import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analyzePhoto, PhotoType, PHOTO_TYPES } from '@/lib/claims/photo-analysis'
import { z } from 'zod'
import { requireAuthUserId } from '@/lib/auth'

const RequestSchema = z.object({
  uploadId: z.string(),
  photoType: z.enum(PHOTO_TYPES as unknown as [string, ...string[]]),
  location: z.string().optional(),
})

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
    const body = await request.json()
    const { uploadId, photoType, location } = RequestSchema.parse(body)

    // Verify claim exists and belongs to user
    const ownershipCheck = await verifyClaimOwnership(claimId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    // Get claim with scope data
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        carrierScopes: {
          orderBy: { version: 'desc' },
          take: 1,
          include: { lineItems: true }
        }
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    // Get the upload
    const upload = await db.upload.findUnique({
      where: { id: uploadId }
    })

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    // Create photo analysis record
    const photoAnalysis = await db.photoAnalysis.create({
      data: {
        claimId,
        uploadId,
        photoType,
        location,
        analysisStatus: 'analyzing',
      }
    })

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'photo_uploaded',
        description: `Photo uploaded for analysis: ${photoType}${location ? ` - ${location}` : ''}`,
        details: { uploadId, photoType, location }
      }
    })

    // Get existing scope items for context
    const existingScopeItems = claim.carrierScopes[0]?.lineItems.map(
      item => `${item.xactimateCode || ''} - ${item.description}`
    )

    try {
      // Analyze the photo
      const analysisResult = await analyzePhoto(
        upload.fileUrl,
        photoType as PhotoType,
        existingScopeItems
      )

      // Update with analysis results
      const updatedAnalysis = await db.photoAnalysis.update({
        where: { id: photoAnalysis.id },
        data: {
          analysisStatus: 'completed',
          analyzedAt: new Date(),
          detectedComponents: analysisResult.components,
          detectedDamage: analysisResult.damage,
          measurements: analysisResult.measurements,
          rawAnalysis: analysisResult,
        }
      })

      // Log completion
      await db.claimActivity.create({
        data: {
          claimId,
          action: 'photo_analyzed',
          description: `Photo analysis completed: ${analysisResult.components.length} components detected, ${analysisResult.damage.length} damage areas identified`,
          details: {
            photoAnalysisId: updatedAnalysis.id,
            componentCount: analysisResult.components.length,
            damageCount: analysisResult.damage.length,
            recommendations: analysisResult.supplementRecommendations,
          }
        }
      })

      return NextResponse.json({
        photoAnalysis: updatedAnalysis,
        analysis: analysisResult,
      })

    } catch (analysisError) {
      // Update status to failed
      await db.photoAnalysis.update({
        where: { id: photoAnalysis.id },
        data: {
          analysisStatus: 'failed',
          rawAnalysis: { error: String(analysisError) }
        }
      })

      console.error('Photo analysis failed:', analysisError)
      return NextResponse.json({ 
        error: 'Photo analysis failed',
        details: analysisError instanceof Error ? analysisError.message : 'Unknown error',
        photoAnalysisId: photoAnalysis.id,
      }, { status: 500 })
    }

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const photoAnalyses = await db.photoAnalysis.findMany({
      where: { claimId },
      orderBy: { createdAt: 'desc' },
      include: {
        deltas: true,
      }
    })

    return NextResponse.json({ photoAnalyses })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
