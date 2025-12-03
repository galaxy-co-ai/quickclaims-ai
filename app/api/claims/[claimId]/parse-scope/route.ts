import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseCarrierScope, calculateScopeMetrics, identifyMissingItems } from '@/lib/claims/scope-parser'
import { extractScopeText } from '@/lib/extract/scope'
import { requireAuthUserId } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ claimId: string }>
}

/**
 * Verify claim belongs to user
 */
async function verifyClaimOwnership(claimId: string, userId: string) {
  return db.claim.findFirst({
    where: { id: claimId, project: { userId } },
    include: { project: true },
  })
}

/**
 * POST /api/claims/[claimId]/parse-scope
 * Parse an uploaded carrier scope PDF and extract line items
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params
    const body = await request.json()
    const { uploadId } = body as { uploadId: string }

    if (!claimId) {
      return NextResponse.json(
        { error: 'Claim ID is required' },
        { status: 400 }
      )
    }

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      )
    }

    // Get the claim and verify ownership
    const claim = await verifyClaimOwnership(claimId, userId)

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Get the upload
    const upload = await db.upload.findUnique({
      where: { id: uploadId },
    })

    if (!upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    // Extract text from PDF
    const scopeText = await extractScopeText(upload.fileUrl, upload.mimeType)

    if (!scopeText || scopeText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract text from document' },
        { status: 400 }
      )
    }

    // Parse with AI
    const parsedScope = await parseCarrierScope(scopeText)

    // Calculate metrics
    const metrics = calculateScopeMetrics(parsedScope)

    // Identify potentially missing items
    const potentialMissing = identifyMissingItems(parsedScope)

    // Determine next version number
    const existingScopes = await db.carrierScope.findMany({
      where: { claimId },
      orderBy: { version: 'desc' },
      take: 1,
    })
    const nextVersion = existingScopes.length > 0 ? existingScopes[0].version + 1 : 1

    // Create CarrierScope record
    const carrierScope = await db.carrierScope.create({
      data: {
        claimId,
        version: nextVersion,
        uploadId,
        totalRCV: parsedScope.totals.rcv,
        totalACV: parsedScope.totals.acv,
        totalDepreciation: parsedScope.totals.depreciation,
        totalTax: parsedScope.totals.tax,
        totalOP: parsedScope.totals.overheadProfit,
        deductible: parsedScope.totals.deductible,
        netPayment: parsedScope.totals.netPayment,
        totalSquares: metrics.totalSquares,
        dollarPerSquare: metrics.dollarPerSquare,
        dwellingRCV: parsedScope.coverages?.find(c => c.type === 'Dwelling')?.rcv,
        otherStructuresRCV: parsedScope.coverages?.find(c => c.type === 'Other Structures')?.rcv,
        rawText: scopeText.slice(0, 50000), // Store for reference
        lineItems: {
          create: parsedScope.lineItems.map((item, index) => ({
            lineNumber: item.lineNumber ?? index + 1,
            xactimateCode: item.xactimateCode,
            description: item.description,
            category: item.category,
            trade: item.trade,
            area: item.area,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            tax: item.tax,
            overheadProfit: item.overheadProfit,
            rcv: item.rcv,
            ageLife: item.ageLife,
            depreciationPct: item.depreciationPct,
            depreciation: item.depreciation,
            acv: item.acv,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    })

    // Update claim with parsed info if this is first scope
    if (nextVersion === 1) {
      await db.claim.update({
        where: { id: claimId },
        data: {
          claimNumber: parsedScope.claimNumber || claim.claimNumber,
          carrier: parsedScope.carrier || claim.carrier,
          adjusterName: parsedScope.adjusterName || claim.adjusterName,
          dateOfLoss: parsedScope.dateOfLoss 
            ? new Date(parsedScope.dateOfLoss)
            : claim.dateOfLoss,
          status: 'scope_review',
        },
      })
    }

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'scope_parsed',
        description: `Carrier scope v${nextVersion} parsed: ${carrierScope.lineItems.length} line items, $${carrierScope.totalRCV.toLocaleString()} RCV`,
        details: {
          version: nextVersion,
          lineItemCount: carrierScope.lineItems.length,
          totalRCV: carrierScope.totalRCV,
          totalACV: carrierScope.totalACV,
          dollarPerSquare: carrierScope.dollarPerSquare,
          potentialMissing,
        },
      },
    })

    return NextResponse.json({
      success: true,
      carrierScope: {
        id: carrierScope.id,
        version: carrierScope.version,
        totalRCV: carrierScope.totalRCV,
        totalACV: carrierScope.totalACV,
        totalDepreciation: carrierScope.totalDepreciation,
        deductible: carrierScope.deductible,
        netPayment: carrierScope.netPayment,
        totalSquares: carrierScope.totalSquares,
        dollarPerSquare: carrierScope.dollarPerSquare,
        lineItemCount: carrierScope.lineItems.length,
      },
      metrics,
      potentialMissing,
      parsedData: {
        claimNumber: parsedScope.claimNumber,
        carrier: parsedScope.carrier,
        adjusterName: parsedScope.adjusterName,
        propertyAddress: parsedScope.propertyAddress,
        tradeSummaries: parsedScope.tradeSummaries,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to parse carrier scope' },
      { status: 500 }
    )
  }
}
