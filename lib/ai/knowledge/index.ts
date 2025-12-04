/**
 * Knowledge Base Index
 * 
 * Central export for all AI knowledge modules.
 * Import from this file to access the complete knowledge base.
 * 
 * PHASE 1 EXPANSION (December 2025):
 * - Added manufacturer installation requirements (GAF, OC, CertainTeed, Atlas)
 * - Added carrier objection patterns and rebuttal templates
 * - Expanded commonly missed items from 15 to 40+
 * - Added measurement intelligence (EagleView/HOVER parsing)
 */

// Workflow knowledge
export * from './supplement-workflow'

// Xactimate codes and pricing
export * from './xactimate-full'

// IRC building codes
export * from './irc-codes-full'

// Commonly missed items (expanded 40+ items)
export * from './commonly-missed'

// Document templates
export * from './document-templates'

// NEW: Manufacturer installation requirements
export * from './manufacturer-requirements'

// NEW: Carrier objection patterns and rebuttals
export * from './carrier-patterns'

// NEW: Measurement report intelligence
export * from './measurement-intelligence'

// NEW PHASE 2: OSHA safety requirements
export * from './osha-safety'

// NEW PHASE 2: State-specific code amendments
export * from './state-codes'

// NEW PHASE 3: Depreciation knowledge
export * from './depreciation'

// NEW PHASE 3: Damage identification patterns
export * from './damage-patterns'

/**
 * Knowledge Summary
 * 
 * Quick reference for what's available in the knowledge base:
 * 
 * CORE WORKFLOW:
 * 1. WORKFLOW_PHASES - The 6-phase supplement workflow
 * 2. KPI_TARGETS - Target metrics for estimators
 * 3. CLAIM_STATUSES - Status progression for claims
 * 4. GUARDRAILS - What to avoid (policy interpretation, etc.)
 * 
 * XACTIMATE:
 * 5. XACTIMATE_CODES - 100+ line item codes with pricing
 * 6. getXactimateInfo() - Look up a specific code
 * 7. searchXactimateCodes() - Search codes by description
 * 
 * IRC CODES:
 * 8. IRC_ROOFING_CODES - All relevant IRC codes with defense templates
 * 9. getIRCCode() - Look up a specific IRC code
 * 10. getIRCForXactimate() - Get IRC codes for an Xactimate code
 * 11. generateIRCDefenseNote() - Generate defense note from template
 * 
 * COMMONLY MISSED ITEMS:
 * 12. COMMONLY_MISSED_ITEMS - 40+ items carriers frequently omit
 * 13. getDefenseNote() - Get defense note for an item
 * 14. getMissedItemsByPriority() - Filter by critical/high/medium
 * 
 * DOCUMENT TEMPLATES:
 * 15. DOCUMENT_TEMPLATES - Templates for all document types
 * 16. getDocumentTemplate() - Get template for a document type
 * 
 * MANUFACTURER REQUIREMENTS (NEW):
 * 17. GAF_REQUIREMENTS - GAF installation requirements
 * 18. OWENS_CORNING_REQUIREMENTS - OC installation requirements
 * 19. CERTAINTEED_REQUIREMENTS - CertainTeed installation requirements
 * 20. ATLAS_REQUIREMENTS - Atlas installation requirements
 * 21. MANUFACTURER_WARRANTIES - Warranty requirements and void conditions
 * 22. getManufacturerRequirements() - Get all requirements for a manufacturer
 * 23. getManufacturerDefenseNote() - Get defense note for manufacturer requirement
 * 
 * CARRIER PATTERNS (NEW):
 * 24. CARRIER_OBJECTIONS - Common objection patterns with rebuttals
 * 25. CARRIER_PROFILES - Carrier-specific tips and tendencies
 * 26. getCarrierObjections() - Get objections common to a carrier
 * 27. getCarrierProfile() - Get carrier profile and tips
 * 28. getRebuttalTemplate() - Get rebuttal template for objection type
 * 
 * MEASUREMENT INTELLIGENCE (NEW):
 * 29. WASTE_EXCLUSIONS - Items NOT included in waste calculations
 * 30. PITCH_FACTORS - Pitch multipliers and steep charge codes
 * 31. WASTE_GUIDELINES - Waste % by roof complexity
 * 32. EAGLEVIEW_FIELDS - EagleView report field definitions
 * 33. HOVER_FIELDS - HOVER report field definitions
 * 34. QUANTITY_CALCULATIONS - Formulas for calculating quantities
 * 35. calculateQuantities() - Calculate all quantities from measurements
 * 
 * OSHA SAFETY (NEW PHASE 2):
 * 36. OSHA_FALL_PROTECTION - 29 CFR 1926 Subpart M requirements
 * 37. SAFETY_THRESHOLDS - Height and pitch thresholds for fall protection
 * 38. SAFETY_CHARGES - Xactimate charges justified by OSHA compliance
 * 39. getApplicableOSHARequirements() - Get OSHA requirements for a project
 * 40. getApplicableSafetyCharges() - Get safety charges for pitch/height
 * 
 * STATE CODES (NEW PHASE 2):
 * 41. STATE_AMENDMENTS - State-specific code amendments beyond IRC
 * 42. STATE_WIND_ZONES - Wind zone requirements by state
 * 43. HAIL_ZONES - Hail frequency and impact rating requirements
 * 44. getStateAmendments() - Get amendments for a specific state
 * 45. isHighHailZone() - Check if state is in high hail zone
 * 
 * DEPRECIATION (NEW PHASE 3):
 * 46. ROOFING_LIFE_EXPECTANCY - Material life expectancy tables
 * 47. DEPRECIATION_METHODS - How carriers calculate depreciation
 * 48. POLICY_TYPES - RCV, ACV, and policy type differences
 * 49. DEPRECIATION_CHALLENGES - How to challenge excessive depreciation
 * 50. calculateDepreciation() - Calculate expected depreciation
 * 
 * DAMAGE PATTERNS (NEW PHASE 3):
 * 51. HAIL_DAMAGE_PATTERNS - Hail damage identification
 * 52. WIND_DAMAGE_PATTERNS - Wind damage identification
 * 53. NON_STORM_CONDITIONS - Age, manufacturing, mechanical damage
 * 54. PHOTO_DOCUMENTATION - Photo requirements and best practices
 * 55. getDamagePattern() - Get pattern info by damage type
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
- Key metric: Dollar per Square (D$/SQ) = Final Roof RCV ÷ squares

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
- R908.5 - Flashing replacement when damaged

### Commonly Missed Items (40+ items)
**Critical (Code Required):**
- Drip Edge (R905.2.8.5) - carriers often omit entirely
- Starter Course (R905.2.8.1) - not in waste calculations
- Ice & Water Shield (R905.2.7.1) - valleys and eaves
- Step Flashing (R905.2.8.3) - wall intersections
- Hip/Ridge Cap - not in EagleView waste

**High Priority:**
- Steep/High charges, Supervisor hours, Cricket/saddle
- Decking replacement, Valley metal, Chimney flashing

**Additional Items:**
- Pipe jacks, Exhaust caps, Power vents, D&R items
- Ground/pool tarping, O&P, Permit, PU/SU
- Fascia, Soffit, Gutter repairs

### Manufacturer Requirements (NEW)
**GAF Products:**
- Starter strip required for warranty
- IWS in valleys per installation manual
- TimberTex/Seal-A-Ridge for hip/ridge
- Proper ventilation required (voids warranty if inadequate)

**Owens Corning Products:**
- Starter strip required for system warranty
- WeatherLock IWS in valleys
- DecoRidge for Duration series
- SureNail Technology nailing requirements

**CertainTeed Products:**
- SwiftStart starter required
- WinterGuard IWS in critical areas
- Shadow Ridge cap for Landmark series

### Carrier Objection Patterns (NEW)
**Very Common Objections:**
- "Drip edge not required in this market" → Cite IRC R905.2.8.5 (mandatory)
- "Starter included in waste" → Show EagleView disclaimer
- "Step flashing can be reused" → Cite IRC R908.5 (damaged during removal)
- "Hip/ridge in waste" → Show measurement report exclusion

**Carrier-Specific Tips:**
- State Farm: Code citations carry weight
- Allstate: Documentation-heavy, multiple rebuttal rounds
- USAA: Generally fair, quick decisions
- Farmers: May use regional pricing arguments

### Measurement Intelligence (NEW)
**CRITICAL - Waste Does NOT Include:**
- Hip & Ridge cap (add separately)
- Starter strip (add separately)
- Ice & water shield (separate line item)
- Valley metal (separate line item)
- Drip edge (separate line item)

**Pitch Factors & Steep Charges:**
- 7/12-9/12 = RFGSTEEP ($56.27/SQ)
- 10/12-12/12 = RFGSTEEP+ ($88.44/SQ)
- >12/12 = RFGSTEEP++ ($114.88/SQ)

**Waste Guidelines:**
- Simple roof: 10%
- Moderate: 12%
- Complex: 15%
- Cut-up: 18%

### Document Types
- Delta Analysis Report
- Cover Letter for Submission
- Defense Notes (per line item)
- Supplement Letter (comprehensive)
- Rebuttal Response
- Project Brief
- Inspection Checklist
- Photo Evidence Report

### OSHA Safety Requirements (NEW)
**29 CFR 1926 Subpart M - Fall Protection:**
- Fall protection required at 6+ feet
- Steep roofs (>4/12) require personal fall arrest systems
- Safety monitoring requires competent person on-site
- Steep charges include OSHA compliance labor reduction

**Safety Charge Justifications:**
- RFGSTEEP (7/12-9/12): Workers in harnesses at reduced productivity
- RFGSTEEP+ (10/12-12/12): Full fall arrest required, dramatic productivity reduction
- RFGHIGH+ (2+ stories): Material handling, fall protection setup
- RFGSUPR: Competent person required by OSHA 1926.502(h)

### State-Specific Code Amendments (NEW)
**States with Enhanced Requirements:**
- Florida: HVHZ zones, secondary water barrier, 6 nails/shingle
- Texas: TDI windstorm certification in coastal counties
- Colorado: Extended ice barrier, impact-resistant requirements
- Oklahoma/Kansas: Hail zone requirements
- Coastal states: Wind-borne debris region compliance

**High Hail Zones:**
- Texas, Oklahoma, Kansas, Colorado, Nebraska, Minnesota
- May require Class 3 or Class 4 impact-resistant shingles
- Insurance incentives for impact-resistant materials

### Depreciation Knowledge (NEW)
**Material Life Expectancy:**
- 3-Tab Shingles: 20 years (5%/year)
- Architectural Shingles: 25-30 years (3-4%/year)
- Metal Roofing: 40-50 years (2-2.5%/year)
- Tile/Slate: 50-100 years (1-2%/year)

**Key Rules:**
- LABOR DOES NOT DEPRECIATE
- O&P SHOULD NOT BE DEPRECIATED
- New components (boots, drip edge) should not be over-depreciated
- RCV policies: Depreciation is RECOVERABLE upon completion

### Damage Pattern Identification (NEW)
**Hail Damage Indicators:**
- Random pattern (not aligned with shingles)
- Soft spots when pressing (mat compromised)
- Granule displacement at impact points
- Corroborating metal component damage

**Wind Damage Indicators:**
- Lifted shingles with creases
- Broken seal strips
- Missing tabs following wind direction
- Ridge cap damage

**Non-Storm Conditions to Distinguish:**
- Blistering (manufacturing defect - hollow, follows pattern)
- Normal aging (uniform wear, curling)
- Foot traffic (straight line patterns)
- Improper installation (high nailing, exposed fasteners)

### Response Style
- Defense notes: 2-3 sentences with code citation
- Rebuttals: 2-4 sentences, evidence-based, professional
- Stay construction-only - no policy interpretation
- Evidence over opinion - cite code/spec/photos
`
}
