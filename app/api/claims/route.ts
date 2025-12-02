import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { CreateClaimSchema } from '@/lib/claims/schemas'

const TEMP_USER_ID = 'temp-user-id' // TODO: Replace with auth

/**
 * GET /api/claims
 * List all claims for the current user
 */
export async function GET() {
  try {
    const claims = await db.claim.findMany({
      where: {
        project: {
          userId: TEMP_USER_ID,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            address: true,
            clientName: true,
          },
        },
        carrierScopes: {
          orderBy: { version: 'desc' },
          take: 1,
          select: {
            version: true,
            totalRCV: true,
            totalACV: true,
            dollarPerSquare: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            carrierScopes: true,
            activities: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ claims })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/claims
 * Create a new claim for a project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = CreateClaimSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const input = validationResult.data

    // Verify project exists and belongs to user
    const project = await db.project.findFirst({
      where: {
        id: input.projectId,
        userId: TEMP_USER_ID,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if claim already exists for project
    const existingClaim = await db.claim.findUnique({
      where: { projectId: input.projectId },
    })

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Claim already exists for this project', claimId: existingClaim.id },
        { status: 409 }
      )
    }

    // Create claim
    const claim = await db.claim.create({
      data: {
        projectId: input.projectId,
        claimNumber: input.claimNumber,
        dateOfLoss: input.dateOfLoss ? new Date(input.dateOfLoss) : undefined,
        carrier: input.carrier,
        adjusterName: input.adjusterName,
        adjusterEmail: input.adjusterEmail || undefined,
        adjusterPhone: input.adjusterPhone,
        policyType: input.policyType,
        deductible: input.deductible,
        status: 'intake',
      },
    })

    // Log activity
    await db.claimActivity.create({
      data: {
        claimId: claim.id,
        action: 'created',
        description: 'Claim created',
        details: {
          claimNumber: claim.claimNumber,
          carrier: claim.carrier,
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      claim: {
        id: claim.id,
        projectId: claim.projectId,
        claimNumber: claim.claimNumber,
        carrier: claim.carrier,
        status: claim.status,
        createdAt: claim.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}
