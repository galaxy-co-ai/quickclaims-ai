/**
 * IRC (International Residential Code) Knowledge Base
 * Comprehensive code references for roofing defense notes
 */

export interface IRCCodeReference {
  code: string
  title: string
  section: string
  fullText: string
  summary: string
  applicability: string[]
  defenseTemplate: string
  xactimateCodes: string[]
}

/**
 * Complete IRC code references for roofing
 */
export const IRC_CODES: Record<string, IRCCodeReference> = {
  // Drip Edge
  'R905.2.8.5': {
    code: 'R905.2.8.5',
    title: 'Drip Edge',
    section: 'Asphalt Shingles - Drip Edge',
    fullText: 'A drip edge shall be provided at eaves and gables of shingle roofs. Adjacent pieces of drip edge shall be overlapped a minimum of 2 inches (51 mm). Drip edges shall extend a minimum of 0.25 inch (6.4 mm) below the roof sheathing and extend up the roof deck a minimum of 2 inches (51 mm). Drip edges shall be mechanically fastened to the roof deck at a maximum of 12 inches (305 mm) o.c. with fasteners as specified by the manufacturer.',
    summary: 'Drip edge is mandatory at all eaves and rake edges to protect the roof deck and fascia from water damage.',
    applicability: ['All asphalt shingle roofs', 'Eaves and gables', 'New installations and replacements'],
    defenseTemplate: `Per IRC Section R905.2.8.5, drip edge is required at all eaves and gables of shingle roofs. The code mandates that drip edge "shall be provided" - this is not optional but a code requirement.

The drip edge must:
• Extend minimum 0.25" below roof sheathing
• Extend minimum 2" up the roof deck
• Be mechanically fastened at maximum 12" on center

This item is required for code compliance and proper roof installation. Failure to include drip edge violates building code and would void manufacturer warranties.`,
    xactimateCodes: ['RFGDRIP', 'RFGDRIPA', 'RFGDRIPM']
  },

  // Starter Course
  'R904.1': {
    code: 'R904.1',
    title: 'Roof Covering Materials',
    section: 'General - Roof Covering Materials',
    fullText: 'Roof coverings shall be applied in accordance with the applicable provisions of this section and the manufacturer\'s installation instructions.',
    summary: 'All roofing must be installed per manufacturer specifications, which universally require starter course shingles.',
    applicability: ['All roof installations', 'Manufacturer requirements', 'Warranty compliance'],
    defenseTemplate: `Per IRC Section R904.1, roof coverings must be installed in accordance with manufacturer's installation instructions. Every major shingle manufacturer (GAF, CertainTeed, Owens Corning, etc.) requires starter course shingles at eaves and rakes.

Manufacturer Installation Requirements:
• GAF Pro Start Starter Strip required at eaves/rakes
• CertainTeed SwiftStart required at eaves/rakes
• Owens Corning Starter Shingle required at eaves/rakes

Without starter course, the installation violates:
1. IRC R904.1 (manufacturer requirements)
2. Manufacturer warranty requirements
3. Industry standard installation practices

The starter course provides essential wind resistance and waterproofing at critical edge locations.`,
    xactimateCodes: ['RFGSTRT', 'RFGSTRTA']
  },

  // Ice & Water Shield
  'R905.2.8.2': {
    code: 'R905.2.8.2',
    title: 'Ice Barrier',
    section: 'Asphalt Shingles - Ice Barrier',
    fullText: 'In areas where there has been a history of ice forming along the eaves causing a backup of water, an ice barrier that consists of at least two layers of underlayment cemented together or of a self-adhering polymer modified bitumen sheet shall be used in lieu of normal underlayment and extend from the lowest edges of all roof surfaces to a point at least 24 inches (610 mm) inside the exterior wall line of the building.',
    summary: 'Ice & water shield is required at eaves in cold climates and in all valleys.',
    applicability: ['Cold climate regions', 'Valley installations', 'Low slope areas', 'Eaves in freeze/thaw zones'],
    defenseTemplate: `Per IRC Section R905.2.8.2, ice barrier (ice & water shield) is required in areas with history of ice formation. This self-adhering membrane must extend from the lowest roof edge to at least 24" inside the exterior wall line.

Required Applications:
• All eaves in Climate Zones 5-8 (mandatory)
• All valleys (industry standard/best practice)
• Around penetrations
• Low slope areas under 4:12 pitch

This is a code-mandated protection against ice dam damage. The membrane creates a watertight seal around fasteners, preventing leaks when ice dams form.`,
    xactimateCodes: ['RFGIWS', 'RFGIWSA', 'RFGIWSV']
  },

  // Step Flashing
  'R905.2.8.3': {
    code: 'R905.2.8.3',
    title: 'Sidewall Flashing',
    section: 'Asphalt Shingles - Flashing',
    fullText: 'Flashing shall be installed at wall and roof intersections, at gutters, wherever there is a change in roof slope or direction and around roof openings. Where flashing is of metal, the metal shall be corrosion resistant with a minimum thickness of 0.019 inch (0.483 mm).',
    summary: 'Step flashing is required at all roof-to-wall intersections.',
    applicability: ['Roof-to-wall intersections', 'Dormers', 'Chimneys', 'Skylights'],
    defenseTemplate: `Per IRC Section R905.2.8.3, flashing is required at all wall and roof intersections. Step flashing is the industry-standard method for sealing roof-to-wall connections.

Code Requirements:
• Flashing required at ALL wall/roof intersections
• Metal flashing must be minimum 0.019" thick
• Must be corrosion resistant material

Step flashing cannot be reused during re-roofing:
1. Existing flashing is embedded in wall siding
2. Shingle courses require integration with each flashing piece
3. Reusing old flashing compromises the weather seal

New step flashing is required for proper code-compliant installation.`,
    xactimateCodes: ['RFGSTEP', 'RFGSTEPA', 'RFGSTEPM']
  },

  // Cricket/Saddle
  'R903.2.2': {
    code: 'R903.2.2',
    title: 'Cricket and Saddle',
    section: 'Flashings - Cricket and Saddle',
    fullText: 'A cricket or saddle shall be installed on the ridge side of any chimney or penetration greater than 30 inches (762 mm) wide as measured perpendicular to the slope.',
    summary: 'Crickets are required for chimneys and penetrations over 30" wide.',
    applicability: ['Chimneys over 30" wide', 'Large penetrations', 'Ridge-side installations'],
    defenseTemplate: `Per IRC Section R903.2.2, a cricket or saddle is REQUIRED on the ridge side of any chimney or penetration greater than 30 inches wide.

This is a mandatory code requirement, not optional:
• Prevents water and debris accumulation
• Diverts water around the obstruction
• Required for penetrations > 30" measured perpendicular to slope

The cricket must be properly flashed and integrated with the roof system. This is not an "upgrade" but a code-mandated requirement for proper water management.`,
    xactimateCodes: ['RFGCRKT', 'RFGCRKTA']
  },

  // Roof Deck
  'R905.2.1': {
    code: 'R905.2.1',
    title: 'Roof Deck',
    section: 'Asphalt Shingles - Deck Requirements',
    fullText: 'Asphalt shingles shall be fastened to solidly sheathed decks.',
    summary: 'Shingles must be installed on solid, undamaged decking.',
    applicability: ['All roof installations', 'Deck condition assessment', 'Replacement decisions'],
    defenseTemplate: `Per IRC Section R905.2.1, asphalt shingles must be fastened to "solidly sheathed decks." This code requirement means damaged, deteriorated, or unsound decking must be replaced.

Decking replacement is required when:
• Existing plywood/OSB is delaminated
• Boards are rotted or water damaged
• Decking is not structurally sound
• Deck cannot hold fasteners properly

Installing new shingles on damaged decking:
1. Violates IRC R905.2.1
2. Voids manufacturer warranties
3. Creates safety and performance issues

Decking replacement ensures code compliance and proper shingle installation.`,
    xactimateCodes: ['RFGDECK', 'RFGDECKA', 'RFGDECKP']
  },

  // Underlayment
  'R905.2.7': {
    code: 'R905.2.7',
    title: 'Underlayment',
    section: 'Asphalt Shingles - Underlayment',
    fullText: 'Unless otherwise noted, required underlayment shall conform to ASTM D226, Type I, ASTM D4869, Type I, or ASTM D6757. Self-adhering polymer modified bitumen sheet shall comply with ASTM D1970.',
    summary: 'Proper underlayment meeting ASTM standards is required under all asphalt shingles.',
    applicability: ['All shingle installations', 'Secondary water barrier', 'Warranty requirement'],
    defenseTemplate: `Per IRC Section R905.2.7, underlayment meeting specific ASTM standards is required under asphalt shingles. This provides a secondary water barrier.

Acceptable underlayment types:
• ASTM D226 Type I (15# felt)
• ASTM D4869 Type I (synthetic)
• ASTM D6757 (synthetic)
• ASTM D1970 (self-adhering)

Underlayment is not optional:
1. Provides secondary water protection
2. Required by all shingle manufacturers
3. Necessary for warranty coverage
4. Code-mandated for proper installation`,
    xactimateCodes: ['RFGFELT', 'RFGFELTA', 'RFGSYN']
  },

  // Valley Flashing
  'R905.2.8.1': {
    code: 'R905.2.8.1',
    title: 'Valley Flashing',
    section: 'Asphalt Shingles - Valley Flashing',
    fullText: 'Valley flashing shall be not less than 24 inches (610 mm) wide for open valleys. Valley flashing of metal shall be at least 0.019 inch (0.483 mm) thick.',
    summary: 'Open valleys require minimum 24" wide metal flashing.',
    applicability: ['Open valley installations', 'Closed cut valleys', 'All valley types'],
    defenseTemplate: `Per IRC Section R905.2.8.1, valley flashing is required and must meet specific dimensional requirements:

Open Valley Requirements:
• Minimum 24" wide flashing
• Metal minimum 0.019" thick
• Corrosion-resistant material

For closed-cut or woven valleys:
• Ice & water shield required in valley
• Proper shingle weaving/cutting technique
• Industry-standard installation practices

Valleys are high-volume water flow areas and require proper flashing for effective water management.`,
    xactimateCodes: ['RFGVALY', 'RFGVALYA', 'RFGVALYM']
  },

  // Ventilation
  'R806.1': {
    code: 'R806.1',
    title: 'Ventilation Required',
    section: 'Roof Ventilation',
    fullText: 'Enclosed attics and enclosed rafter spaces formed where ceilings are applied directly to the underside of roof rafters shall have cross ventilation for each separate space by ventilating openings protected against the entrance of rain or snow.',
    summary: 'Attic ventilation is required by code for proper roof system performance.',
    applicability: ['All enclosed attic spaces', 'Cathedral ceilings', 'Ventilation balance'],
    defenseTemplate: `Per IRC Section R806.1, enclosed attic and rafter spaces require ventilation. Proper ventilation extends roof life and prevents moisture damage.

Code Requirements:
• 1 sq ft ventilation per 150 sq ft attic floor (no vapor barrier)
• 1 sq ft per 300 sq ft (with vapor barrier or balanced vents)
• Must have cross-ventilation (intake and exhaust)

Ridge vents, box vents, and turbine vents are code-compliant exhaust ventilation. When replacing a roof, damaged or inadequate ventilation must be addressed for code compliance and manufacturer warranty.`,
    xactimateCodes: ['RFGVENT', 'RFGRIDGV', 'RFGTURB']
  }
}

/**
 * OSHA safety requirements for roofing work
 */
export const OSHA_REQUIREMENTS = {
  'FALL_PROTECTION': {
    code: 'OSHA 1926.501(b)(13)',
    title: 'Residential Construction Fall Protection',
    requirement: 'Each employee engaged in residential construction activities 6 feet or more above lower levels shall be protected by guardrail systems, safety net systems, or personal fall arrest systems.',
    applicability: ['All work 6+ feet above ground', 'Steep slope roofs', 'Multi-story buildings'],
    defenseTemplate: `Per OSHA 1926.501(b)(13), fall protection is required for all roofing work 6 feet or more above lower levels.

Additional safety requirements apply for:
• Steep roofs (over 7/12 pitch) - requires additional safety measures
• Two-story or higher - increased fall hazard
• Low slope roofs - may require warning line systems

Safety-related labor charges are legitimate additions for:
• Steep charges (pitch over 7/12)
• High charges (2+ stories)
• OSHA compliance equipment setup`,
    xactimateCodes: ['RFGSTEEP', 'RFGHIGH', 'RFGSUPR']
  }
}

/**
 * Generate a professional defense note from a delta item
 */
export function generateProfessionalDefenseNote(
  item: {
    xactimateCode?: string | null
    description: string
    ircCode?: string | null
    quantity?: number | null
    unit?: string | null
  },
  claimInfo?: {
    carrier?: string | null
    claimNumber?: string | null
    clientName?: string | null
    address?: string | null
  }
): string {
  const ircRef = item.ircCode ? IRC_CODES[item.ircCode] : null
  
  let note = ''
  
  // Header
  note += `SUPPLEMENT REQUEST - ${item.description.toUpperCase()}\n`
  note += `${'='.repeat(60)}\n\n`
  
  // Item Details
  if (item.xactimateCode) {
    note += `Xactimate Code: ${item.xactimateCode}\n`
  }
  if (item.quantity && item.unit) {
    note += `Quantity: ${item.quantity} ${item.unit}\n`
  }
  note += '\n'
  
  // Code Reference
  if (ircRef) {
    note += `CODE REFERENCE: IRC ${ircRef.code} - ${ircRef.title}\n`
    note += `${'-'.repeat(60)}\n\n`
    note += `${ircRef.defenseTemplate}\n\n`
  } else if (item.ircCode === 'OSHA') {
    const oshaRef = OSHA_REQUIREMENTS.FALL_PROTECTION
    note += `SAFETY REFERENCE: ${oshaRef.code}\n`
    note += `${'-'.repeat(60)}\n\n`
    note += `${oshaRef.defenseTemplate}\n\n`
  } else {
    note += `JUSTIFICATION\n`
    note += `${'-'.repeat(60)}\n\n`
    note += `This item is required for proper roof installation per industry standards and manufacturer specifications.\n\n`
  }
  
  // Conclusion
  note += `CONCLUSION\n`
  note += `${'-'.repeat(60)}\n\n`
  note += `This item is required for a code-compliant, warrantable roof installation. `
  note += `Omission of this item would result in:\n`
  note += `• Building code violations\n`
  note += `• Voided manufacturer warranty\n`
  note += `• Potential for premature roof failure\n\n`
  note += `We respectfully request this item be approved and added to the scope.\n`
  
  return note
}

/**
 * Generate a complete defense package with all approved deltas
 */
export function generateDefensePackage(
  deltas: Array<{
    xactimateCode?: string | null
    description: string
    ircCode?: string | null
    quantity?: number | null
    unit?: string | null
    estimatedRCV?: number | null
    defenseNote?: string | null
  }>,
  claimInfo: {
    carrier?: string | null
    claimNumber?: string | null
    clientName?: string | null
    address?: string | null
    dateOfLoss?: string | null
  }
): string {
  let package_ = ''
  
  // Cover Page
  package_ += `${'='.repeat(70)}\n`
  package_ += `                    SUPPLEMENT REQUEST PACKAGE\n`
  package_ += `${'='.repeat(70)}\n\n`
  
  if (claimInfo.clientName) package_ += `Insured: ${claimInfo.clientName}\n`
  if (claimInfo.address) package_ += `Property: ${claimInfo.address}\n`
  if (claimInfo.carrier) package_ += `Carrier: ${claimInfo.carrier}\n`
  if (claimInfo.claimNumber) package_ += `Claim #: ${claimInfo.claimNumber}\n`
  if (claimInfo.dateOfLoss) package_ += `Date of Loss: ${claimInfo.dateOfLoss}\n`
  package_ += `Date Prepared: ${new Date().toLocaleDateString()}\n\n`
  
  // Summary
  package_ += `SUPPLEMENT SUMMARY\n`
  package_ += `${'-'.repeat(70)}\n\n`
  package_ += `Total Items Requested: ${deltas.length}\n`
  
  const totalRCV = deltas.reduce((sum, d) => sum + (d.estimatedRCV || 0), 0)
  if (totalRCV > 0) {
    package_ += `Estimated Total Value: $${totalRCV.toLocaleString()}\n`
  }
  package_ += '\n'
  
  // Items Table
  package_ += `ITEMS REQUESTED:\n`
  deltas.forEach((delta, i) => {
    package_ += `${i + 1}. ${delta.description}`
    if (delta.xactimateCode) package_ += ` (${delta.xactimateCode})`
    if (delta.ircCode) package_ += ` [IRC ${delta.ircCode}]`
    package_ += '\n'
  })
  package_ += '\n'
  
  // Individual Defense Notes
  package_ += `\n${'='.repeat(70)}\n`
  package_ += `                    DETAILED JUSTIFICATIONS\n`
  package_ += `${'='.repeat(70)}\n\n`
  
  deltas.forEach((delta, i) => {
    package_ += `\n${i + 1}. `
    package_ += generateProfessionalDefenseNote(delta, claimInfo)
    package_ += '\n'
  })
  
  // Footer
  package_ += `\n${'='.repeat(70)}\n`
  package_ += `This supplement package has been prepared with reference to the\n`
  package_ += `International Residential Code (IRC) and industry standard practices.\n`
  package_ += `All items are required for proper, code-compliant roof installation.\n`
  package_ += `${'='.repeat(70)}\n`
  
  return package_
}

/**
 * Get IRC reference for a delta item
 */
export function getIRCReference(ircCode: string): IRCCodeReference | undefined {
  return IRC_CODES[ircCode]
}

/**
 * Get all IRC codes that apply to a given Xactimate code
 */
export function getIRCCodesForXactimate(xactimateCode: string): IRCCodeReference[] {
  return Object.values(IRC_CODES).filter(
    irc => irc.xactimateCodes.includes(xactimateCode.toUpperCase())
  )
}
