/**
 * Claim Workflow Automation
 * 
 * Automatically advances claim status based on completed actions.
 * Status only moves forward, never backward.
 */

import { db } from '@/lib/db'

type ClaimStatus = 
  | 'intake'
  | 'scope_review'
  | 'delta_analysis'
  | 'supplement_pending'
  | 'awaiting_sol'
  | 'rebuttal'
  | 'build_scheduled'
  | 'post_build'
  | 'invoicing'
  | 'depreciation_pending'
  | 'completed'

const STATUS_ORDER: ClaimStatus[] = [
  'intake',
  'scope_review', 
  'delta_analysis',
  'supplement_pending',
  'awaiting_sol',
  'rebuttal',
  'build_scheduled',
  'post_build',
  'invoicing',
  'depreciation_pending',
  'completed',
]

/**
 * Get the index of a status in the workflow
 */
function getStatusIndex(status: string): number {
  const index = STATUS_ORDER.indexOf(status as ClaimStatus)
  return index >= 0 ? index : 0
}

/**
 * Check claim state and auto-advance status if appropriate
 * Only advances forward, never backward
 */
export async function checkAndAdvanceStatus(claimId: string): Promise<{
  advanced: boolean
  previousStatus: string
  newStatus: string
}> {
  const claim = await db.claim.findUnique({
    where: { id: claimId },
    include: {
      carrierScopes: { select: { id: true } },
      deltas: { where: { status: { in: ['identified', 'approved'] } } },
      project: {
        include: {
          documents: { 
            where: { 
              type: { in: ['delta_analysis', 'defense_notes', 'supplement_letter'] } 
            } 
          }
        }
      }
    }
  })
  
  if (!claim) {
    return { advanced: false, previousStatus: 'unknown', newStatus: 'unknown' }
  }
  
  const currentIndex = getStatusIndex(claim.status)
  let newStatus: ClaimStatus | null = null
  
  // Check conditions for status advancement
  
  // If carrier scope exists, should be at least at scope_review
  if (claim.carrierScopes.length > 0 && currentIndex < getStatusIndex('scope_review')) {
    newStatus = 'scope_review'
  }
  
  // If deltas have been generated, should be at least at delta_analysis
  if (claim.deltas.length > 0 && currentIndex < getStatusIndex('delta_analysis')) {
    newStatus = 'delta_analysis'
  }
  
  // Check for approved deltas and defense documents
  const approvedDeltas = claim.deltas.filter(d => d.status === 'approved')
  const hasDefenseNotes = claim.project.documents.some(d => d.type === 'defense_notes')
  const hasSupplementLetter = claim.project.documents.some(d => d.type === 'supplement_letter')
  
  // If defense notes exist for approved items, advance to supplement_pending
  if ((hasDefenseNotes || hasSupplementLetter) && 
      approvedDeltas.length > 0 && 
      currentIndex < getStatusIndex('supplement_pending')) {
    newStatus = 'supplement_pending'
  }
  
  // Only advance forward, never backward
  if (newStatus && getStatusIndex(newStatus) > currentIndex) {
    await db.claim.update({
      where: { id: claimId },
      data: { status: newStatus }
    })
    
    // Log the status change
    await db.claimActivity.create({
      data: {
        claimId,
        action: 'status_auto_advanced',
        description: `Status auto-advanced from ${claim.status.replace(/_/g, ' ')} to ${newStatus.replace(/_/g, ' ')}`,
        details: {
          previousStatus: claim.status,
          newStatus,
          reason: 'workflow_automation',
        }
      }
    })
    
    return {
      advanced: true,
      previousStatus: claim.status,
      newStatus,
    }
  }
  
  return {
    advanced: false,
    previousStatus: claim.status,
    newStatus: claim.status,
  }
}

/**
 * Get the next expected status based on current status
 */
export function getNextExpectedStatus(currentStatus: string): ClaimStatus | null {
  const currentIndex = getStatusIndex(currentStatus)
  if (currentIndex >= STATUS_ORDER.length - 1) {
    return null // Already at final status
  }
  return STATUS_ORDER[currentIndex + 1]
}

/**
 * Get what actions are needed to advance to the next status
 */
export function getActionsForNextStatus(currentStatus: string): string[] {
  const actions: string[] = []
  const status = currentStatus as ClaimStatus
  
  switch (status) {
    case 'intake':
      actions.push('Upload and parse carrier scope PDF')
      break
    case 'scope_review':
      actions.push('Run delta analysis to identify missing items')
      break
    case 'delta_analysis':
      actions.push('Approve delta items and generate defense notes')
      break
    case 'supplement_pending':
      actions.push('Submit supplement to carrier')
      break
    case 'awaiting_sol':
      actions.push('Receive revised SOL from carrier')
      break
    case 'rebuttal':
      actions.push('Complete rebuttal process')
      break
    case 'build_scheduled':
      actions.push('Complete construction work')
      break
    case 'post_build':
      actions.push('Complete final inspection and invoicing')
      break
    case 'invoicing':
      actions.push('Receive final payment')
      break
    case 'depreciation_pending':
      actions.push('Collect recoverable depreciation')
      break
    default:
      break
  }
  
  return actions
}
