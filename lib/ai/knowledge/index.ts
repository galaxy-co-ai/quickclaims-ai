/**
 * Knowledge Base Index
 * 
 * Central export for all AI knowledge modules.
 * Import from this file to access the complete knowledge base.
 */

// Workflow knowledge
export * from './supplement-workflow'

// Xactimate codes and pricing
export * from './xactimate-full'

// IRC building codes
export * from './irc-codes-full'

// Commonly missed items
export * from './commonly-missed'

// Document templates
export * from './document-templates'

/**
 * Knowledge Summary
 * 
 * Quick reference for what's available in the knowledge base:
 * 
 * 1. WORKFLOW_PHASES - The 6-phase supplement workflow
 * 2. KPI_TARGETS - Target metrics for estimators
 * 3. CLAIM_STATUSES - Status progression for claims
 * 4. GUARDRAILS - What to avoid (policy interpretation, etc.)
 * 
 * 5. XACTIMATE_CODES - 100+ line item codes with pricing
 * 6. getXactimateInfo() - Look up a specific code
 * 7. searchXactimateCodes() - Search codes by description
 * 
 * 8. IRC_ROOFING_CODES - All relevant IRC codes with defense templates
 * 9. getIRCCode() - Look up a specific IRC code
 * 10. getIRCForXactimate() - Get IRC codes for an Xactimate code
 * 11. generateIRCDefenseNote() - Generate defense note from template
 * 
 * 12. COMMONLY_MISSED_ITEMS - Items carriers frequently omit
 * 13. getDefenseNote() - Get defense note for an item
 * 14. getMissedItemsByPriority() - Filter by critical/high/medium
 * 
 * 15. DOCUMENT_TEMPLATES - Templates for all document types
 * 16. getDocumentTemplate() - Get template for a document type
 */

// Utility function to get a full context summary for the AI
export function getKnowledgeSummary(): string {
  return `
## Domain Knowledge Available

### Supplement Workflow
- 6-phase workflow: Intake → Scope Review → Estimate Build → Submission → Rebuttals → Post-Build
- 24-hour turnaround SLA for complete files
- 48-hour follow-up cadence with carriers
- Target: 20-30% claim lift, ~2.5 notes per job per week

### Xactimate Codes
- 100+ roofing line item codes with descriptions and average pricing
- Categories: shingles, removal, underlayment, edges, starter, ridge, flashing, valley, ventilation, decking, steep charges, detach-reset, specialty

### IRC Building Codes
- R903.2.2 - Crickets/saddles (>30" penetrations)
- R904.1 - Manufacturer installation compliance
- R905.2.1 - Solid sheathing requirement
- R905.2.7.1 - Ice & water shield
- R905.2.8.1 - Starter course required
- R905.2.8.2 - Valley requirements
- R905.2.8.3 - Step flashing required
- R905.2.8.5 - Drip edge required
- R806.2 - Ventilation requirements

### Commonly Missed Items (Critical)
- Drip Edge (R905.2.8.5) - carriers often omit entirely
- Starter Course (R905.2.8.1) - not in waste calculations
- Ice & Water Shield (R905.2.7.1) - valleys and eaves
- Step Flashing (R905.2.8.3) - wall intersections
- Hip/Ridge Cap - not in EagleView waste

### Document Types
- Delta Analysis Report
- Cover Letter for Submission
- Defense Notes (per line item)
- Supplement Letter (comprehensive)
- Rebuttal Response
- Project Brief
- Inspection Checklist
- Photo Evidence Report

### Response Style
- Defense notes: 2-3 sentences with code citation
- Rebuttals: 2-4 sentences, evidence-based, professional
- Stay construction-only - no policy interpretation
- Evidence over opinion - cite code/spec/photos
`
}
