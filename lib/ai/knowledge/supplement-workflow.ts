/**
 * RISE Supplement Workflow Knowledge Base
 * 
 * This file contains the complete supplement workflow process that the AI
 * assistant uses to understand and generate documents.
 */

export const WORKFLOW_PHASES = {
  INTAKE: {
    name: 'Intake & Triage',
    description: 'Verify required docs/photos/measurements; halt 24hr clock until complete',
    requiredInputs: [
      'Adjuster scope PDF',
      'Carrier correspondence',
      'Claim number',
      'Insured name',
      'Property address',
      'Measurements (EagleView/Hover)',
      'Roof squares and pitch',
      'Inspection photos',
      'Local code references',
      'Contractor profile/logo'
    ],
    outputs: ['Request list for missing items', 'Intake confirmation']
  },
  SCOPE_REVIEW: {
    name: 'Scope Review & Strategy',
    description: 'Compare carrier scope vs. as-built reality; produce delta list',
    activities: [
      'Compare carrier scope against photos and measurements',
      'Build delta list (missing items, quantity corrections, code requirements)',
      'Decide supplement type (pre-production vs post-build)',
      'Draft Supplement Rationale Map'
    ],
    outputs: ['Delta Analysis', 'Supplement Strategy']
  },
  ESTIMATE_BUILD: {
    name: 'Estimate Build (Xactimate)',
    description: 'Correct quantities; add missing items; write defense notes',
    activities: [
      'Select proper price list (region & month)',
      'Add line items with defense notes',
      'Calibrate quantities (waste %, pitch, steep charges)',
      'Include safety/OSHA, site setup, haul-off, permits, O&P',
      'Cross-check template packs for missed items'
    ],
    outputs: ['Corrected Xactimate Estimate', 'Defense Notes']
  },
  SUBMISSION: {
    name: 'Submission Package',
    description: 'Assemble and send complete supplement package to carrier',
    deliverables: [
      'Branded Xactimate estimate PDF with line-item notes',
      'Photo packet organized by elevation/area',
      'Measurement exhibits (EagleView/Hover)',
      'Code & manufacturer citations',
      'Cover email summarizing deltas'
    ],
    outputs: ['Submission Package', 'Cover Letter']
  },
  REBUTTALS: {
    name: 'Rebuttals & Approvals',
    description: '2-4 sentence micro-responses per objection with authoritative citations',
    activities: [
      'Capture adjuster feedback verbatim',
      'Map each objection to counter-evidence',
      'Write micro-rebuttals (2-4 sentences)',
      'Stay construction-only (no policy interpretation)'
    ],
    outputs: ['Rebuttal Responses', 'Updated Submission']
  },
  POST_BUILD: {
    name: 'Build Day & Post-Build',
    description: 'Document change conditions; submit post-build supplements; track depreciation',
    activities: [
      'Verify approved quantities vs on-site reality',
      'Document change conditions (hidden damage, decking, etc.)',
      'Submit post-build supplements',
      'Issue final invoice',
      'Verify depreciation release'
    ],
    outputs: ['Post-Build Supplement', 'Final Invoice']
  }
} as const

export const KPI_TARGETS = {
  turnaround: '24 business hours for complete files',
  followUpCadence: '~2.5 notes per job per week',
  dollarPerSquare: 'Final Roof RCV ÷ roof squares (key metric)',
  claimLift: '20-30%+ increase vs carrier scope',
  velocity: 'Time from submission → SOL → depreciation release'
}

export const CLAIM_STATUSES = [
  'Missing Info to Start',
  'Supplement Sent to Insurance',
  'Supplement Received by Insurance',
  'Escalated Claim',
  'Waiting on Build',
  'Confirm Work Completed',
  'Final Invoice Sent to Carrier',
  'Final Invoice Received by Carrier',
  'Money Released to Homeowner',
  'Completed'
] as const

export const GUARDRAILS = [
  'Evidence over opinion - if not visible in photos or cited to code/spec, flag as insufficient',
  'No policy interpretation - stay on construction, codes, manufacturer specs, safety, site conditions',
  'Professional tone - firm, factual, respectful; zero fluff; short bullets',
  'Every line item must be defendable with code/manufacturer/spec or site condition',
  'Protect client data - use approved systems only'
]

export const RESPONSE_STYLE = {
  defenseNote: '2-3 sentences with one precise code/manufacturer citation',
  rebuttal: '2-4 sentences per objection with one authoritative cite',
  coverEmail: 'Bullet summary of key deltas with requested action',
  deltaTable: 'What / Why / Proof (photo/code/spec) / Est. impact'
}
