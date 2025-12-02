import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  generateSupplementDocument, 
  generateXactimateCSV,
  generateSupplementLineItems,
  generatePhotoBinder,
  validateSupplementPackage,
  type SupplementPackageData 
} from '@/lib/claims/xactimate-export'
import { generateProfessionalDefenseNote } from '@/lib/claims/irc-codes'

// GET supplement package data or download
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json, document, csv, photos

    // Get claim with all related data
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        project: {
          select: {
            clientName: true,
            address: true,
          }
        },
        carrierScopes: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            lineItems: true,
          }
        },
        deltas: {
          where: {
            status: { in: ['approved', 'included'] }
          }
        },
        photoAnalyses: {
          where: { analysisStatus: 'completed' },
          include: {
            claim: {
              include: {
                project: {
                  include: {
                    uploads: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const latestScope = claim.carrierScopes[0]
    
    // Generate supplement line items from approved deltas
    const supplementLineItems = generateSupplementLineItems(
      claim.deltas.map(d => ({
        xactimateCode: d.xactimateCode,
        description: d.description,
        quantity: d.quantity,
        unit: d.unit,
        estimatedRCV: d.estimatedRCV,
      })),
      (latestScope?.lineItems?.length ?? 0) + 1
    )

    const totalSupplementAmount = supplementLineItems.reduce((sum, item) => sum + item.rcv, 0)

    // Build defense notes
    const defenseNotes = claim.deltas.map(d => ({
      xactimateCode: d.xactimateCode,
      description: d.description,
      ircCode: d.ircCode,
      defenseNote: d.defenseNote || generateProfessionalDefenseNote({
        xactimateCode: d.xactimateCode,
        description: d.description,
        ircCode: d.ircCode,
        quantity: d.quantity,
        unit: d.unit,
      }),
    }))

    // Get photo URLs
    const photos = await Promise.all(
      claim.photoAnalyses.map(async (pa) => {
        const upload = await db.upload.findUnique({ where: { id: pa.uploadId } })
        return {
          id: pa.id,
          type: pa.photoType,
          location: pa.location,
          url: upload?.fileUrl || '',
        }
      })
    )

    // Build package data
    const packageData: SupplementPackageData = {
      claim: {
        claimNumber: claim.claimNumber,
        carrier: claim.carrier,
        dateOfLoss: claim.dateOfLoss?.toISOString().split('T')[0] || null,
        policyType: claim.policyType,
      },
      insured: {
        name: claim.project.clientName,
        address: claim.project.address,
      },
      contractor: {
        name: 'QuickClaims Contractor', // TODO: Get from user settings
        license: '',
        phone: '',
        email: '',
      },
      lineItems: supplementLineItems,
      defenseNotes,
      photos,
      totalRCV: latestScope?.totalRCV || 0,
      totalSupplementAmount,
    }

    // Validate package
    const validation = validateSupplementPackage(packageData)

    // Return based on format
    if (format === 'document') {
      const document = generateSupplementDocument(packageData)
      return new NextResponse(document, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="supplement-${claim.claimNumber || claimId}.txt"`,
        }
      })
    }

    if (format === 'csv') {
      const csv = generateXactimateCSV(supplementLineItems)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="supplement-lineitems-${claim.claimNumber || claimId}.csv"`,
        }
      })
    }

    if (format === 'photos') {
      const binder = generatePhotoBinder(photos)
      return new NextResponse(binder, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="photo-binder-${claim.claimNumber || claimId}.txt"`,
        }
      })
    }

    // Default: JSON with all data
    return NextResponse.json({
      package: packageData,
      validation,
      summary: {
        totalItems: supplementLineItems.length,
        totalSupplementAmount,
        originalRCV: latestScope?.totalRCV || 0,
        newTotalRCV: (latestScope?.totalRCV || 0) + totalSupplementAmount,
        photoCount: photos.length,
        defenseNoteCount: defenseNotes.length,
      }
    })

  } catch (error) {
    console.error('Error generating supplement package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST to finalize and mark supplement as sent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params
    const body = await request.json()
    const { sentTo, sentDate, notes } = body

    // Update claim status
    const claim = await db.claim.update({
      where: { id: claimId },
      data: {
        status: 'supplement_pending',
      }
    })

    // Mark all approved deltas as included
    await db.deltaItem.updateMany({
      where: {
        claimId,
        status: 'approved'
      },
      data: {
        status: 'included'
      }
    })

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'supplement_sent',
        description: `Supplement package sent to ${sentTo || 'carrier'}`,
        details: {
          sentTo,
          sentDate: sentDate || new Date().toISOString(),
          notes,
        }
      }
    })

    return NextResponse.json({
      success: true,
      claim: {
        id: claim.id,
        status: claim.status,
      },
      message: 'Supplement marked as sent'
    })

  } catch (error) {
    console.error('Error finalizing supplement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
