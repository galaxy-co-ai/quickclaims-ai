import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateDefensePackage, generateProfessionalDefenseNote } from '@/lib/claims/irc-codes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json, text, package

    // Get claim with approved deltas
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
          where: {
            status: { in: ['approved', 'included'] }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const claimInfo = {
      carrier: claim.carrier,
      claimNumber: claim.claimNumber,
      clientName: claim.project.clientName,
      address: claim.project.address,
      dateOfLoss: claim.dateOfLoss?.toISOString().split('T')[0],
    }

    // Generate based on format
    if (format === 'package') {
      // Full defense package with all approved deltas
      const package_ = generateDefensePackage(
        claim.deltas.map(d => ({
          xactimateCode: d.xactimateCode,
          description: d.description,
          ircCode: d.ircCode,
          quantity: d.quantity,
          unit: d.unit,
          estimatedRCV: d.estimatedRCV,
          defenseNote: d.defenseNote,
        })),
        claimInfo
      )

      return new NextResponse(package_, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="defense-package-${claim.claimNumber || claimId}.txt"`,
        }
      })
    }

    if (format === 'text') {
      // Individual notes as plain text
      const notes = claim.deltas.map(d => 
        generateProfessionalDefenseNote({
          xactimateCode: d.xactimateCode,
          description: d.description,
          ircCode: d.ircCode,
          quantity: d.quantity,
          unit: d.unit,
        }, claimInfo)
      ).join('\n\n' + '='.repeat(70) + '\n\n')

      return new NextResponse(notes, {
        headers: {
          'Content-Type': 'text/plain',
        }
      })
    }

    // Default: JSON format
    const defenseNotes = claim.deltas.map(d => ({
      deltaId: d.id,
      xactimateCode: d.xactimateCode,
      description: d.description,
      ircCode: d.ircCode,
      status: d.status,
      defenseNote: d.defenseNote || generateProfessionalDefenseNote({
        xactimateCode: d.xactimateCode,
        description: d.description,
        ircCode: d.ircCode,
        quantity: d.quantity,
        unit: d.unit,
      }, claimInfo),
      quantity: d.quantity,
      unit: d.unit,
      estimatedRCV: d.estimatedRCV,
    }))

    return NextResponse.json({
      claim: claimInfo,
      approvedCount: claim.deltas.length,
      defenseNotes,
    })

  } catch (error) {
    console.error('Error generating defense notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST to regenerate defense notes for all approved deltas
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params

    // Get claim with approved deltas
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
          where: {
            status: { in: ['approved', 'included'] }
          }
        }
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const claimInfo = {
      carrier: claim.carrier,
      claimNumber: claim.claimNumber,
      clientName: claim.project.clientName,
      address: claim.project.address,
      dateOfLoss: claim.dateOfLoss?.toISOString().split('T')[0],
    }

    // Regenerate defense notes for each delta
    const updated = await Promise.all(
      claim.deltas.map(async (delta) => {
        const newNote = generateProfessionalDefenseNote({
          xactimateCode: delta.xactimateCode,
          description: delta.description,
          ircCode: delta.ircCode,
          quantity: delta.quantity,
          unit: delta.unit,
        }, claimInfo)

        return db.deltaItem.update({
          where: { id: delta.id },
          data: { defenseNote: newNote }
        })
      })
    )

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'defense_notes_generated',
        description: `Defense notes generated for ${updated.length} approved supplement items`,
        details: {
          count: updated.length,
          deltaIds: updated.map(d => d.id),
        }
      }
    })

    return NextResponse.json({
      success: true,
      updated: updated.length,
      message: `Defense notes regenerated for ${updated.length} items`,
    })

  } catch (error) {
    console.error('Error regenerating defense notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
