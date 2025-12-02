import { z } from 'zod'

/**
 * Zod schemas for insurance claim data validation
 */

// Line item from carrier scope
export const LineItemSchema = z.object({
  lineNumber: z.number().optional(),
  xactimateCode: z.string().optional(),
  description: z.string(),
  category: z.string(),
  trade: z.string().optional(),
  area: z.string().optional(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number().default(0),
  tax: z.number().default(0),
  overheadProfit: z.number().default(0),
  rcv: z.number().default(0),
  ageLife: z.string().optional(),
  depreciationPct: z.number().optional(),
  depreciation: z.number().default(0),
  acv: z.number().default(0),
})

export type ParsedLineItem = z.infer<typeof LineItemSchema>

// Trade summary from carrier scope
export const TradeSummarySchema = z.object({
  trade: z.string(),
  rcv: z.number(),
  tax: z.number().default(0),
  overheadProfit: z.number().default(0),
  depreciation: z.number().default(0),
  acv: z.number(),
})

export type TradeSummary = z.infer<typeof TradeSummarySchema>

// Full parsed carrier scope
export const ParsedScopeSchema = z.object({
  // Claim identification
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(), // Will be parsed to Date
  policyNumber: z.string().optional(),
  
  // Carrier info
  carrier: z.string().optional(),
  adjusterName: z.string().optional(),
  
  // Property info
  insuredName: z.string().optional(),
  propertyAddress: z.string().optional(),
  
  // Coverage breakdown
  coverages: z.array(z.object({
    type: z.string(), // "Dwelling", "Other Structures"
    rcv: z.number(),
    depreciation: z.number(),
    acv: z.number(),
  })).optional(),
  
  // Summary totals
  totals: z.object({
    rcv: z.number(),
    tax: z.number().default(0),
    overheadProfit: z.number().default(0),
    depreciation: z.number(),
    acv: z.number(),
    deductible: z.number().default(0),
    netPayment: z.number(),
  }),
  
  // Roof-specific metrics (if identifiable)
  roofMetrics: z.object({
    totalSquares: z.number().optional(),
    dollarPerSquare: z.number().optional(),
    pitch: z.string().optional(), // e.g., "8/12"
    stories: z.number().optional(),
  }).optional(),
  
  // Trade summaries
  tradeSummaries: z.array(TradeSummarySchema).optional(),
  
  // Individual line items
  lineItems: z.array(LineItemSchema),
})

export type ParsedScope = z.infer<typeof ParsedScopeSchema>

// Claim workflow status
export const ClaimStatusSchema = z.enum([
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
  'completed'
])

export type ClaimStatus = z.infer<typeof ClaimStatusSchema>

// Claim status display info
export const CLAIM_STATUS_INFO: Record<ClaimStatus, { label: string; color: string; description: string }> = {
  intake: {
    label: 'Intake',
    color: 'gray',
    description: 'Initial claim information being gathered'
  },
  scope_review: {
    label: 'Scope Review',
    color: 'blue',
    description: 'Carrier scope uploaded and being analyzed'
  },
  delta_analysis: {
    label: 'Delta Analysis',
    color: 'purple',
    description: 'Identifying missing/incorrect line items'
  },
  supplement_pending: {
    label: 'Supplement Pending',
    color: 'yellow',
    description: 'Supplement package being prepared'
  },
  awaiting_sol: {
    label: 'Awaiting SOL',
    color: 'orange',
    description: 'Waiting for Statement of Loss response'
  },
  rebuttal: {
    label: 'Rebuttal',
    color: 'red',
    description: 'Contesting denied line items'
  },
  build_scheduled: {
    label: 'Build Scheduled',
    color: 'cyan',
    description: 'Work approved, installation scheduled'
  },
  post_build: {
    label: 'Post-Build',
    color: 'teal',
    description: 'Day-of findings being documented'
  },
  invoicing: {
    label: 'Invoicing',
    color: 'indigo',
    description: 'Final invoice submitted'
  },
  depreciation_pending: {
    label: 'Depreciation Pending',
    color: 'amber',
    description: 'Waiting for recoverable depreciation release'
  },
  completed: {
    label: 'Completed',
    color: 'green',
    description: 'Claim fully closed'
  }
}

// Create claim input
export const CreateClaimSchema = z.object({
  projectId: z.string().cuid(),
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(), // ISO date string
  carrier: z.string().optional(),
  adjusterName: z.string().optional(),
  adjusterEmail: z.string().email().optional().or(z.literal('')),
  adjusterPhone: z.string().optional(),
  policyType: z.enum(['RCV', 'ACV', 'RPS']).optional(),
  deductible: z.number().optional(),
})

export type CreateClaimInput = z.infer<typeof CreateClaimSchema>

// Update claim input
export const UpdateClaimSchema = CreateClaimSchema.partial().extend({
  status: ClaimStatusSchema.optional(),
})

export type UpdateClaimInput = z.infer<typeof UpdateClaimSchema>

// Delta types
export const DeltaTypeSchema = z.enum([
  'missing',        // Item exists on property but not in scope
  'incorrect_qty',  // Quantity in scope doesn't match actual
  'wrong_code',     // Wrong Xactimate code used
  'code_required',  // IRC code requires this item
  'lkq',           // Like, Kind, Quality - existing item not matched
])

export type DeltaType = z.infer<typeof DeltaTypeSchema>

// Activity action types
export const ClaimActivityActionSchema = z.enum([
  'created',
  'status_change',
  'scope_uploaded',
  'scope_parsed',
  'delta_identified',
  'supplement_created',
  'supplement_sent',
  'sol_received',
  'rebuttal_sent',
  'approved',
  'denied',
  'note_added',
  'email_sent',
  'payment_received',
])

export type ClaimActivityAction = z.infer<typeof ClaimActivityActionSchema>
