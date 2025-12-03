import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateDefenseNote, generateSupplementLetter, generateRebuttal } from '@/lib/ai/anthropic'

interface RouteParams {
  params: Promise<{ claimId: string }>
}

/**
 * POST /api/claims/[claimId]/defense-notes/generate
 * Generate AI-powered defense notes using Claude for approved deltas
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { claimId } = await params
    const body = await request.json()
    const { deltaId, type = 'defense' } = body as { deltaId?: string; type?: 'defense' | 'letter' | 'rebuttal' }

    // Get claim with related data
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        project: {
          select: {
            clientName: true,
            address: true,
          }
        },
        deltas: {
          where: deltaId 
            ? { id: deltaId }
            : { status: { in: ['approved', 'included'] } },
          include: {
            photoAnalysis: {
              select: {
                photoType: true,
                location: true,
                detectedDamage: true,
              }
            }
          }
        },
        carrierScopes: {
          orderBy: { version: 'desc' },
          take: 1,
          select: {
            totalRCV: true,
          }
        }
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    if (claim.deltas.length === 0) {
      return NextResponse.json(
        { error: 'No approved deltas found. Approve items in Delta Analysis first.' },
        { status: 400 }
      )
    }

    // Generate based on type
    if (type === 'letter') {
      // Generate full supplement letter
      const letter = await generateSupplementLetter({
        insuredName: claim.project.clientName,
        propertyAddress: claim.project.address,
        claimNumber: claim.claimNumber || undefined,
        carrierName: claim.carrier || 'Insurance Carrier',
        adjusterName: claim.adjusterName || undefined,
        dateOfLoss: claim.dateOfLoss?.toISOString().split('T')[0],
        items: claim.deltas.map(d => ({
          description: d.description,
          xactimateCode: d.xactimateCode || undefined,
          quantity: d.quantity || undefined,
          unit: d.unit || undefined,
          rcv: d.estimatedRCV || undefined,
          defenseNote: d.defenseNote || undefined,
        })),
        totalSupplementAmount: claim.deltas.reduce((sum, d) => sum + (d.estimatedRCV || 0), 0),
        originalRCV: claim.carrierScopes[0]?.totalRCV || 0,
      })

      // Log activity
      await db.claimActivity.create({
        data: {
          claimId,
          action: 'supplement_letter_generated',
          description: 'AI-generated supplement letter created',
          details: {
            itemCount: claim.deltas.length,
            model: 'claude-sonnet-4',
          }
        }
      })

      return NextResponse.json({
        success: true,
        type: 'letter',
        content: letter,
      })
    }

    if (type === 'rebuttal' && deltaId) {
      // Generate rebuttal for a specific denied item
      const delta = claim.deltas[0]
      const body = await request.json()
      const { denialReason } = body as { denialReason?: string }

      if (!denialReason) {
        return NextResponse.json(
          { error: 'denialReason is required for rebuttal generation' },
          { status: 400 }
        )
      }

      const rebuttal = await generateRebuttal({
        itemDescription: delta.description,
        denialReason,
        xactimateCode: delta.xactimateCode || undefined,
        ircCode: delta.ircCode || undefined,
        photoEvidence: delta.evidenceNotes || undefined,
      })

      return NextResponse.json({
        success: true,
        type: 'rebuttal',
        deltaId,
        content: rebuttal,
      })
    }

    // Default: Generate defense notes for each delta
    const results = await Promise.all(
      claim.deltas.map(async (delta) => {
        // Build photo evidence description
        let photoEvidence: string | undefined
        if (delta.photoAnalysis) {
          const damage = delta.photoAnalysis.detectedDamage as Array<{ damageType: string; severity: string; description: string }> | null
          photoEvidence = `${delta.photoAnalysis.photoType} photo at ${delta.photoAnalysis.location || 'property'}. `
          if (damage && damage.length > 0) {
            photoEvidence += `Damage observed: ${damage.map(d => `${d.damageType} (${d.severity})`).join(', ')}`
          }
        }

        const defenseNote = await generateDefenseNote({
          itemDescription: delta.description,
          xactimateCode: delta.xactimateCode || undefined,
          ircCode: delta.ircCode || undefined,
          photoEvidence: photoEvidence || delta.evidenceNotes || undefined,
          carrierName: claim.carrier || undefined,
          claimContext: `${claim.project.clientName} at ${claim.project.address}`,
        })

        // Update the delta with the new defense note
        await db.deltaItem.update({
          where: { id: delta.id },
          data: { defenseNote }
        })

        return {
          deltaId: delta.id,
          description: delta.description,
          defenseNote,
        }
      })
    )

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'ai_defense_notes_generated',
        description: `AI-generated defense notes for ${results.length} items`,
        details: {
          count: results.length,
          deltaIds: results.map(r => r.deltaId),
          model: 'claude-sonnet-4',
        }
      }
    })

    return NextResponse.json({
      success: true,
      type: 'defense',
      generated: results.length,
      results,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate defense notes', details: errorMessage },
      { status: 500 }
    )
  }
}
