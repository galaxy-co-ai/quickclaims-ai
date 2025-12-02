/**
 * Claim Workflow Tracking Utilities
 * Provides helpers for tracking claim progression and follow-up reminders
 */

export const WORKFLOW_STAGES = [
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
] as const

export type WorkflowStage = typeof WORKFLOW_STAGES[number]

export interface WorkflowStageInfo {
  stage: WorkflowStage
  label: string
  description: string
  expectedDays: number // Expected days in this stage
  nextActions: string[]
  alertThresholdDays: number // Days after which to alert
}

export const WORKFLOW_STAGE_INFO: Record<WorkflowStage, WorkflowStageInfo> = {
  intake: {
    stage: 'intake',
    label: 'Intake',
    description: 'Initial claim setup and information gathering',
    expectedDays: 1,
    alertThresholdDays: 3,
    nextActions: [
      'Collect insurance policy information',
      'Upload carrier statement of loss (SOL)',
      'Verify property address and owner info',
    ],
  },
  scope_review: {
    stage: 'scope_review',
    label: 'Scope Review',
    description: 'Reviewing carrier scope for completeness',
    expectedDays: 2,
    alertThresholdDays: 5,
    nextActions: [
      'Review line items for accuracy',
      'Check D$/SQ against market rates',
      'Identify missing items',
      'Run delta analysis',
    ],
  },
  delta_analysis: {
    stage: 'delta_analysis',
    label: 'Delta Analysis',
    description: 'Analyzing differences between carrier scope and actual requirements',
    expectedDays: 3,
    alertThresholdDays: 7,
    nextActions: [
      'Review AI-detected missing items',
      'Approve or reject delta items',
      'Add IRC code references',
      'Generate defense notes',
      'Build supplement package',
    ],
  },
  supplement_pending: {
    stage: 'supplement_pending',
    label: 'Supplement Pending',
    description: 'Supplement submitted, awaiting carrier response',
    expectedDays: 14,
    alertThresholdDays: 21,
    nextActions: [
      'Follow up with adjuster if no response',
      'Prepare for re-inspection if needed',
      'Document all carrier communications',
    ],
  },
  awaiting_sol: {
    stage: 'awaiting_sol',
    label: 'Awaiting SOL',
    description: 'Waiting for revised Statement of Loss from carrier',
    expectedDays: 10,
    alertThresholdDays: 14,
    nextActions: [
      'Follow up on SOL status',
      'Request expedited processing if delayed',
      'Review when received for supplement acceptance',
    ],
  },
  rebuttal: {
    stage: 'rebuttal',
    label: 'Rebuttal',
    description: 'Supplement denied, preparing rebuttal',
    expectedDays: 5,
    alertThresholdDays: 10,
    nextActions: [
      'Review denial reasons',
      'Gather additional documentation',
      'Prepare rebuttal letter with IRC references',
      'Consider escalation paths',
    ],
  },
  build_scheduled: {
    stage: 'build_scheduled',
    label: 'Build Scheduled',
    description: 'Approved scope, construction scheduled',
    expectedDays: 30,
    alertThresholdDays: 45,
    nextActions: [
      'Confirm material orders',
      'Verify crew availability',
      'Notify homeowner of schedule',
      'Prepare for build day documentation',
    ],
  },
  post_build: {
    stage: 'post_build',
    label: 'Post Build',
    description: 'Construction complete, final documentation',
    expectedDays: 5,
    alertThresholdDays: 10,
    nextActions: [
      'Complete photo documentation',
      'Get homeowner sign-off',
      'Submit final invoice',
      'Request Certificate of Completion',
    ],
  },
  invoicing: {
    stage: 'invoicing',
    label: 'Invoicing',
    description: 'Invoice submitted, awaiting payment',
    expectedDays: 14,
    alertThresholdDays: 30,
    nextActions: [
      'Follow up on payment status',
      'Address any carrier questions',
      'File depreciation recovery if applicable',
    ],
  },
  depreciation_pending: {
    stage: 'depreciation_pending',
    label: 'Depreciation Pending',
    description: 'Awaiting depreciation recovery payment',
    expectedDays: 30,
    alertThresholdDays: 60,
    nextActions: [
      'Submit depreciation recovery request',
      'Follow up with carrier',
      'Document completion for payment release',
    ],
  },
  completed: {
    stage: 'completed',
    label: 'Completed',
    description: 'Claim fully resolved',
    expectedDays: 0,
    alertThresholdDays: 0,
    nextActions: [],
  },
}

/**
 * Calculate days a claim has been in its current stage
 */
export function getDaysInStage(
  lastStatusChange: Date,
  currentDate: Date = new Date()
): number {
  const diff = currentDate.getTime() - lastStatusChange.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if a claim is overdue based on its stage
 */
export function isClaimOverdue(
  stage: WorkflowStage,
  daysInStage: number
): boolean {
  const info = WORKFLOW_STAGE_INFO[stage]
  return daysInStage > info.alertThresholdDays
}

/**
 * Get urgency level based on days in stage
 */
export function getUrgencyLevel(
  stage: WorkflowStage,
  daysInStage: number
): 'normal' | 'warning' | 'urgent' {
  const info = WORKFLOW_STAGE_INFO[stage]
  
  if (stage === 'completed') return 'normal'
  if (daysInStage <= info.expectedDays) return 'normal'
  if (daysInStage <= info.alertThresholdDays) return 'warning'
  return 'urgent'
}

/**
 * Get the next workflow stage
 */
export function getNextStage(currentStage: WorkflowStage): WorkflowStage | null {
  const currentIndex = WORKFLOW_STAGES.indexOf(currentStage)
  if (currentIndex === -1 || currentIndex === WORKFLOW_STAGES.length - 1) {
    return null
  }
  return WORKFLOW_STAGES[currentIndex + 1]
}

/**
 * Get previous workflow stage
 */
export function getPreviousStage(currentStage: WorkflowStage): WorkflowStage | null {
  const currentIndex = WORKFLOW_STAGES.indexOf(currentStage)
  if (currentIndex <= 0) {
    return null
  }
  return WORKFLOW_STAGES[currentIndex - 1]
}

/**
 * Calculate claim age from creation date
 */
export function getClaimAge(createdAt: Date, currentDate: Date = new Date()): number {
  const diff = currentDate.getTime() - createdAt.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format days as human readable
 */
export function formatDaysAgo(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`
  if (days < 14) return '1 week'
  if (days < 30) return `${Math.floor(days / 7)} weeks`
  if (days < 60) return '1 month'
  return `${Math.floor(days / 30)} months`
}

/**
 * Generate follow-up reminder message
 */
export function getFollowUpMessage(
  stage: WorkflowStage,
  daysInStage: number,
  carrier?: string
): string | null {
  const info = WORKFLOW_STAGE_INFO[stage]
  const urgency = getUrgencyLevel(stage, daysInStage)
  
  if (urgency === 'normal') return null
  
  const carrierName = carrier || 'the carrier'
  
  switch (stage) {
    case 'supplement_pending':
      return urgency === 'urgent'
        ? `Urgent: Supplement has been pending ${daysInStage} days. Contact ${carrierName} immediately.`
        : `Supplement pending ${daysInStage} days. Consider following up with ${carrierName}.`
    
    case 'awaiting_sol':
      return urgency === 'urgent'
        ? `Urgent: Still waiting for revised SOL after ${daysInStage} days. Escalate with ${carrierName}.`
        : `Waiting ${daysInStage} days for revised SOL. Follow up recommended.`
    
    case 'invoicing':
      return urgency === 'urgent'
        ? `Urgent: Invoice outstanding ${daysInStage} days. Contact ${carrierName} about payment.`
        : `Invoice pending ${daysInStage} days. Consider following up.`
    
    case 'depreciation_pending':
      return urgency === 'urgent'
        ? `Urgent: Depreciation recovery pending ${daysInStage} days. Follow up immediately.`
        : `Depreciation recovery pending ${daysInStage} days.`
    
    case 'rebuttal':
      return urgency === 'urgent'
        ? `Urgent: Rebuttal in progress ${daysInStage} days. Complete and submit.`
        : `Rebuttal preparation taking longer than expected.`
    
    default:
      return `Claim in ${info.label} for ${daysInStage} days (expected: ${info.expectedDays} days).`
  }
}
