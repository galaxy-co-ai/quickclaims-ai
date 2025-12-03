import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UpdateClaimSchema } from '@/lib/claims/schemas'
import { requireAuthUserId } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ claimId: string }>
}

/**
 * Verify claim belongs to user
 */
async function verifyClaimOwnership(claimId: string, userId: string) {
  const claim = await db.claim.findFirst({
    where: { 
      id: claimId,
      project: { userId }
    },
  })
  return claim
}

/**
 * GET /api/claims/[claimId]
 * Get a single claim with all details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params

    // Verify ownership
    const ownershipCheck = await verifyClaimOwnership(claimId, userId)
    if (!ownershipCheck) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        project: {
          select: {
            id: true,
            address: true,
            clientName: true,
            projectType: true,
            status: true,
          },
        },
        carrierScopes: {
          orderBy: { version: 'desc' },
          include: {
            lineItems: {
              orderBy: { lineNumber: 'asc' },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Calculate summary stats
    const latestScope = claim.carrierScopes[0]
    const summary = latestScope ? {
      latestVersion: latestScope.version,
      totalRCV: latestScope.totalRCV,
      totalACV: latestScope.totalACV,
      totalDepreciation: latestScope.totalDepreciation,
      deductible: latestScope.deductible,
      netPayment: latestScope.netPayment,
      totalSquares: latestScope.totalSquares,
      dollarPerSquare: latestScope.dollarPerSquare,
      lineItemCount: latestScope.lineItems.length,
      // Group by category
      categoryCounts: latestScope.lineItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // Group by category RCV
      categoryRCV: latestScope.lineItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.rcv
        return acc
      }, {} as Record<string, number>),
    } : null

    return NextResponse.json({
      claim,
      summary,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/claims/[claimId]
 * Update a claim
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params
    const body = await request.json()

    // Validate input
    const validationResult = UpdateClaimSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const input = validationResult.data

    // Get current claim and verify ownership
    const currentClaim = await verifyClaimOwnership(claimId, userId)

    if (!currentClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Update claim
    const claim = await db.claim.update({
      where: { id: claimId },
      data: {
        claimNumber: input.claimNumber,
        dateOfLoss: input.dateOfLoss ? new Date(input.dateOfLoss) : undefined,
        carrier: input.carrier,
        adjusterName: input.adjusterName,
        adjusterEmail: input.adjusterEmail || undefined,
        adjusterPhone: input.adjusterPhone,
        policyType: input.policyType,
        deductible: input.deductible,
        status: input.status,
      },
    })

    // Log status change if status changed
    if (input.status && input.status !== currentClaim.status) {
      await db.claimActivity.create({
        data: {
          claimId,
          action: 'status_change',
          description: `Status changed from ${currentClaim.status} to ${input.status}`,
          details: {
            previousStatus: currentClaim.status,
            newStatus: input.status,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      claim,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to update claim' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/claims/[claimId]
 * Delete a claim
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await requireAuthUserId()
    const { claimId } = await params

    // Verify ownership before deleting
    const claim = await verifyClaimOwnership(claimId, userId)
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    await db.claim.delete({
      where: { id: claimId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}
