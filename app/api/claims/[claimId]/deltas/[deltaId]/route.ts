import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const UpdateSchema = z.object({
  status: z.enum(['identified', 'approved', 'denied', 'included']).optional(),
  defenseNote: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  estimatedRCV: z.number().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string; deltaId: string }> }
) {
  try {
    const { claimId, deltaId } = await params
    const body = await request.json()
    const updates = UpdateSchema.parse(body)

    // Verify delta belongs to claim
    const existing = await db.deltaItem.findFirst({
      where: { id: deltaId, claimId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Delta not found' }, { status: 404 })
    }

    const updated = await db.deltaItem.update({
      where: { id: deltaId },
      data: updates,
    })

    // Log status changes
    if (updates.status && updates.status !== existing.status) {
      await db.claimActivity.create({
        data: {
          claimId,
          action: 'delta_status_changed',
          description: `Delta "${existing.description.slice(0, 50)}..." status changed from ${existing.status} to ${updates.status}`,
          details: {
            deltaId,
            previousStatus: existing.status,
            newStatus: updates.status,
          },
        },
      })
    }

    return NextResponse.json({ delta: updated })

  } catch (error) {
    console.error('Error updating delta:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string; deltaId: string }> }
) {
  try {
    const { claimId, deltaId } = await params

    // Verify delta belongs to claim
    const existing = await db.deltaItem.findFirst({
      where: { id: deltaId, claimId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Delta not found' }, { status: 404 })
    }

    await db.deltaItem.delete({
      where: { id: deltaId },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting delta:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
