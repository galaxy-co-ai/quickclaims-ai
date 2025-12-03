/**
 * Complete IRC (International Residential Code) Reference
 * 
 * These code references are used to generate defense notes and justify
 * supplement line items to insurance carriers.
 */

export interface IRCCode {
  code: string
  title: string
  requirement: string
  fullText: string
  relatedXactimateCodes: string[]
  defenseNoteTemplate: string
}

export const IRC_ROOFING_CODES: IRCCode[] = [
  // ==========================================
  // CHAPTER 9 - ROOF ASSEMBLIES
  // ==========================================
  {
    code: 'R903.2.2',
    title: 'Crickets and Saddles',
    requirement: 'Required on the ridge side of any chimney or penetration greater than 30 inches wide',
    fullText: 'A cricket or saddle shall be installed on the ridge side of any chimney or penetration more than 30 inches (762 mm) wide as measured perpendicular to the slope. Cricket or saddle coverings shall be sheet metal or of the same material as the roof covering.',
    relatedXactimateCodes: ['RFGCRKT'],
    defenseNoteTemplate: 'Cricket/saddle required per IRC R903.2.2 for chimney/penetration exceeding 30" width. Measurement confirms [X]" width. Metal cricket shows storm damage and will be further damaged during tear-off; replacement necessary.'
  },
  {
    code: 'R904.1',
    title: 'Manufacturer Installation Instructions',
    requirement: 'Roof assemblies must comply with code and manufacturer installation instructions',
    fullText: 'Roof assemblies shall be designed and installed in accordance with this code and the approved manufacturer\'s installation instructions such that the roof assembly shall serve to protect the building or structure.',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+'],
    defenseNoteTemplate: 'Per IRC R904.1, roof assemblies must be installed per manufacturer instructions. [Manufacturer] installation guide Section [X] specifically requires [component]. Installation without this component voids warranty and violates code.'
  },
  {
    code: 'R905.2.1',
    title: 'Sheathing Requirements',
    requirement: 'Shingles must be fastened to solidly sheathed decking',
    fullText: 'Asphalt shingles shall be fastened to solidly sheathed decks.',
    relatedXactimateCodes: ['RFGSH+', 'RFGSH5/8', 'RFGSHW1/2', 'RFGSHW5/8', 'RFGDECK'],
    defenseNoteTemplate: 'Decking replacement required per IRC R905.2.1 which mandates shingles be fastened to solidly sheathed decks. Photos document [damaged/spaced/deteriorated] decking that does not meet code requirements.'
  },
  {
    code: 'R905.2.2',
    title: 'Slope Requirements',
    requirement: 'Minimum slope for asphalt shingles is 2:12',
    fullText: 'Asphalt shingles shall only be used on roof slopes of 2:12 or greater. For roof slopes from 2:12 to less than 4:12, double underlayment application is required.',
    relatedXactimateCodes: ['RFGBI', 'RFGBU3'],
    defenseNoteTemplate: 'Per IRC R905.2.2, asphalt shingles require minimum 2:12 slope. Area at [location] measures [X]:12 slope which is below minimum. Modified bitumen or built-up roofing required for this low-slope section.'
  },
  {
    code: 'R905.2.7',
    title: 'Underlayment Requirements',
    requirement: 'Underlayment required under asphalt shingles',
    fullText: 'Unless otherwise noted, required underlayment shall conform to ASTM D226 Type I, ASTM D4869 Type I, II, III or IV, or ASTM D6757. Self-adhering polymer modified bitumen sheet shall comply with ASTM D1970.',
    relatedXactimateCodes: ['RFGFELT15', 'RFGFELT30', 'RFGSYN'],
    defenseNoteTemplate: 'Underlayment required per IRC R905.2.7. Existing underlayment must be reinstalled to return property to pre-storm condition. Synthetic felt used per manufacturer specifications.'
  },
  {
    code: 'R905.2.7.1',
    title: 'Ice Barrier (Ice & Water Shield)',
    requirement: 'Ice barrier required in areas with history of ice dams',
    fullText: 'In areas where there has been a history of ice forming along the eaves causing a backup of water, an ice barrier that consists of at least two layers of underlayment cemented together or a self-adhering polymer modified bitumen sheet shall be used in lieu of normal underlayment and extend from the lowest edges of all roof surfaces to a point at least 24 inches inside the exterior wall line of the building.',
    relatedXactimateCodes: ['RFGIWS'],
    defenseNoteTemplate: 'Ice & water shield membrane required per IRC R905.2.7.1 and [Manufacturer] installation instructions. This area has documented history of ice dams. IWS must extend from eaves to a point at least 24" inside exterior wall line. Valley application requires ≥36" IWS per manufacturer specs.'
  },
  {
    code: 'R905.2.8',
    title: 'Flashing Requirements',
    requirement: 'Flashing required at wall intersections, direction changes, and penetrations',
    fullText: 'Flashings shall be installed in accordance with the manufacturer\'s installation instructions. At a minimum, flashings shall be installed at wall and roof intersections, at gutters, wherever there is a change in roof slope or direction and around roof openings.',
    relatedXactimateCodes: ['RFGSTEP', 'RFGLFL', 'RFGCNTFL', 'RFGFLCH'],
    defenseNoteTemplate: 'Flashing required per IRC R905.2.8 at all wall intersections, direction changes, and penetrations. Photos document [number] locations requiring flashing installation/replacement.'
  },
  {
    code: 'R905.2.8.1',
    title: 'Starter Course',
    requirement: 'Starter strip shingles required at all roof eaves',
    fullText: 'Starter strip shingles, or the equivalent, shall be applied at all roof eaves. Starter shingles shall overhang the deck at eaves by 1/4 inch to 3/4 inch (6 to 19 mm) and at rake by 1/4 inch to 3/4 inch (6 to 19 mm).',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+'],
    defenseNoteTemplate: 'Starter strip shingles REQUIRED per IRC R905.2.8.1 at ALL roof eaves. EagleView measurement report confirms this is NOT included in waste calculation and must be added as separate line item. Total eave LF: [X].'
  },
  {
    code: 'R905.2.8.2',
    title: 'Valley Requirements',
    requirement: 'Valley linings required per manufacturer instructions',
    fullText: 'Valley linings shall be installed in accordance with the manufacturer\'s installation instructions where required by the manufacturer. Closed valleys shall have a lining of not less than 36 inches wide. Open valleys shall have valley lining of not less than 24 inches wide.',
    relatedXactimateCodes: ['RFGVMTL', 'RFGVMTLW', 'RFGIWS'],
    defenseNoteTemplate: 'Valley treatment required per IRC R905.2.8.2. [Open/Closed] valley at [location] requires [36"/24"] minimum valley lining. Photos show open valley requiring metal lining and IWS membrane. Valley metal must be replaced to maintain LKQ.'
  },
  {
    code: 'R905.2.8.3',
    title: 'Step Flashing',
    requirement: 'Step flashing required at roof-to-wall intersections',
    fullText: 'Where vertical surfaces intersect a sloping roof plane, step flashing shall be used. Each step flashing shall be a minimum of 4 inches by 4 inches (102 mm by 102 mm).',
    relatedXactimateCodes: ['RFGSTEP', 'RFGSTEPC'],
    defenseNoteTemplate: 'Step flashing REQUIRED per IRC R905.2.8.3 at all roof-to-wall intersections. Minimum 4" x 4" step flashing pieces required. Photos document [X] LF of wall intersection requiring step flashing. Existing flashing pried/bent during removal must be replaced per IRC R908.5.'
  },
  {
    code: 'R905.2.8.5',
    title: 'Drip Edge',
    requirement: 'Drip edge required at eaves and rake edges',
    fullText: 'A drip edge shall be provided at eaves and rake edges of shingle roofs. Adjacent segments of drip edge shall be overlapped a minimum of 2 inches (51 mm). Drip edges shall extend 1/4 inch (6 mm) below the roof sheathing and extend back on the roof a minimum of 2 inches (51 mm).',
    relatedXactimateCodes: ['RFGDRIP', 'RFGDRIP+', 'RFGDRIPC'],
    defenseNoteTemplate: 'Drip edge is REQUIRED per IRC R905.2.8.5 at ALL eaves and rake edges of shingle roofs. This is a CODE REQUIREMENT, not optional. Adjacent segments shall overlap minimum 2". Total eave + rake LF per measurement report: [X] LF.'
  },
  {
    code: 'R905.4.1',
    title: 'Metal Roof Deck Requirements',
    requirement: 'Metal roofing requires solid or closely fitted decking',
    fullText: 'Metal roof shingles shall be applied to a solid or closely fitted deck.',
    relatedXactimateCodes: ['RFGMTL'],
    defenseNoteTemplate: 'Metal roofing installation requires solid/closely fitted decking per IRC R905.4.1. Existing decking does not meet this requirement and must be replaced/supplemented.'
  },
  {
    code: 'R908.3.1.1',
    title: 'Roof Recover Limitations',
    requirement: 'Roof recover not permitted over damaged or deteriorated decking',
    fullText: 'A roof recover shall not be permitted where any of the following conditions exist: The existing roof or roof covering is water-soaked or has deteriorated to the point that the existing roof or roof covering is not adequate as a base for additional roofing.',
    relatedXactimateCodes: ['RFGSH+', 'RFGDECK'],
    defenseNoteTemplate: 'Roof recover not permitted per IRC R908.3.1.1 due to water-soaked/deteriorated decking documented in photos. Complete tear-off and decking replacement required before new roof installation.'
  },
  {
    code: 'R908.5',
    title: 'Flashing Replacement',
    requirement: 'Existing flashing that is damaged must be replaced',
    fullText: 'Flashings shall be reconstructed in accordance with approved manufacturer\'s installation instructions. Metal flashing to which bituminous materials are to be applied shall be primed prior to installation.',
    relatedXactimateCodes: ['RFGSTEP', 'RFGLFL', 'RFGCNTFL', 'RFGFLCH'],
    defenseNoteTemplate: 'Existing flashing that is pried, bent, or damaged during tear-off must be replaced per IRC R908.5. Cannot reinstall damaged flashing and maintain weathertight assembly.'
  },

  // ==========================================
  // CHAPTER 8 - ROOF-CEILING CONSTRUCTION
  // ==========================================
  {
    code: 'R803.1',
    title: 'Decking Thickness',
    requirement: 'Minimum decking thickness based on rafter spacing',
    fullText: 'Wood-based structural panels shall meet the requirements of this section. The minimum thickness for roof sheathing shall be as set forth in Table R803.1 based on rafter spacing.',
    relatedXactimateCodes: ['RFGSH5/8', 'RFGSHW5/8'],
    defenseNoteTemplate: 'Decking must be ≥5/8" thick for 24" rafter spacing per IRC R803.1 Table. Attic inspection confirms [X]" rafter spacing. Existing decking at [X]" is below code minimum.'
  },
  {
    code: 'R806.1',
    title: 'Attic Ventilation',
    requirement: 'Enclosed attics require ventilation',
    fullText: 'Enclosed attics and enclosed rafter spaces formed where ceilings are applied directly to the underside of roof rafters shall have cross ventilation for each separate space by ventilating openings.',
    relatedXactimateCodes: ['RFGVENTA', 'RFGVENTR', 'RFGVENTT', 'RFGPAV'],
    defenseNoteTemplate: 'Attic ventilation required per IRC R806.1. NFA (Net Free Area) calculation shows minimum [X] sq ft ventilation needed. Current scope provides [X] sq ft - additional vents required.'
  },
  {
    code: 'R806.2',
    title: 'Ventilation Area',
    requirement: 'Ventilation area must be 1/150 of vented space (or 1/300 with conditions)',
    fullText: 'The minimum net free ventilating area shall be 1/150 of the area of the vented space. The minimum net free ventilating area shall be reduced to 1/300 of the vented space provided that a Class I or II vapor retarder is installed on the warm-in-winter side of the ceiling.',
    relatedXactimateCodes: ['RFGVENTA', 'RFGVENTR', 'RFGVENTT'],
    defenseNoteTemplate: 'Per IRC R806.2, ventilation area must be 1/150 of vented space (or 1/300 with vapor retarder). Attic area: [X] sq ft. Required NFA: [X] sq in. Existing NFA: [X] sq in. Additional ridge vent required: [X] LF.'
  }
]

/**
 * Get IRC code by code string
 */
export function getIRCCode(code: string): IRCCode | undefined {
  return IRC_ROOFING_CODES.find(c => c.code.toUpperCase() === code.toUpperCase())
}

/**
 * Get IRC codes related to a specific Xactimate code
 */
export function getIRCForXactimate(xactimateCode: string): IRCCode[] {
  return IRC_ROOFING_CODES.filter(c => 
    c.relatedXactimateCodes.some(x => x.toUpperCase() === xactimateCode.toUpperCase())
  )
}

/**
 * Search IRC codes by title or requirement
 */
export function searchIRCCodes(query: string): IRCCode[] {
  const q = query.toLowerCase()
  return IRC_ROOFING_CODES.filter(c => 
    c.code.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.requirement.toLowerCase().includes(q)
  )
}

/**
 * Generate a defense note using IRC code template
 */
export function generateIRCDefenseNote(
  ircCode: string, 
  values: Record<string, string | number>
): string | null {
  const code = getIRCCode(ircCode)
  if (!code) return null
  
  let note = code.defenseNoteTemplate
  
  // Replace placeholders with values
  Object.entries(values).forEach(([key, value]) => {
    note = note.replace(new RegExp(`\\[${key}\\]`, 'g'), String(value))
  })
  
  return note
}
