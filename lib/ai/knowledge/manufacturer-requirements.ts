/**
 * Manufacturer Installation Requirements
 * 
 * Comprehensive database of shingle manufacturer installation requirements.
 * These are used to justify supplement line items when carriers deny code-required work.
 * 
 * IMPORTANT: These requirements come directly from manufacturer installation manuals.
 * When carriers deny items, citing specific manufacturer requirements is powerful evidence.
 */

export interface ManufacturerRequirement {
  manufacturer: string
  product: string
  component: string
  requirement: string
  warrantyImpact: string
  documentReference: string
  defenseNote: string
  relatedXactimateCodes: string[]
}

export interface ManufacturerWarranty {
  manufacturer: string
  warrantyType: string
  duration: string
  requirements: string[]
  voidConditions: string[]
}

// ============================================
// GAF ROOFING PRODUCTS
// ============================================

export const GAF_REQUIREMENTS: ManufacturerRequirement[] = [
  // Starter Strip Requirements
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Starter Strip',
    requirement: 'GAF Pro-Start or WeatherBlocker starter strip shingles MUST be installed at all eaves and rakes. Starter strip provides critical adhesive seal line for first course of shingles.',
    warrantyImpact: 'Failure to install proper starter strip VOIDS the GAF System Plus and Golden Pledge warranties.',
    documentReference: 'GAF Shingle Installation Manual, Section 4.1 - Starter Strip Application',
    defenseNote: 'GAF installation instructions require Pro-Start or WeatherBlocker starter strip at ALL eaves and rakes. Per GAF Shingle Installation Manual Section 4.1: "Starter strip shingles must be installed to provide a sealant strip for the first course." Installation without proper starter strip voids manufacturer warranty and violates IRC R904.1.',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+']
  },
  {
    manufacturer: 'GAF',
    product: 'Timberline HDZ / Timberline HD',
    component: 'Ice & Water Shield',
    requirement: 'GAF WeatherWatch or StormGuard ice and water barrier required in valleys, around penetrations, and at eaves in cold climates. Minimum 24" past interior wall line at eaves.',
    warrantyImpact: 'Required for GAF System Plus and Golden Pledge warranties.',
    documentReference: 'GAF Shingle Installation Manual, Section 3.2 - Ice Dam Protection',
    defenseNote: 'GAF WeatherWatch or StormGuard ice barrier required per GAF Installation Manual Section 3.2: "In areas where ice dams may form, an ice barrier is required extending from eave edge to at least 24 inches past the interior wall line." Valley application requires minimum 36" width per manufacturer specs. This is a WARRANTY REQUIREMENT.',
    relatedXactimateCodes: ['RFGIWS']
  },
  {
    manufacturer: 'GAF',
    product: 'Timberline HDZ / Timberline HD',
    component: 'Hip and Ridge Cap',
    requirement: 'GAF TimberTex or Seal-A-Ridge hip and ridge cap shingles required. Standard 3-tab shingles cut for hip/ridge are NOT approved for warranty coverage.',
    warrantyImpact: 'Using non-GAF ridge caps reduces warranty to standard manufacturer warranty only.',
    documentReference: 'GAF Shingle Installation Manual, Section 7 - Ridge Cap Application',
    defenseNote: 'GAF requires TimberTex or Seal-A-Ridge hip and ridge cap shingles per Installation Manual Section 7. Cut 3-tab shingles are NOT approved for warranty coverage. To maintain manufacturer warranty per IRC R904.1, proper GAF ridge cap must be installed.',
    relatedXactimateCodes: ['RFGRIDGC']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Drip Edge',
    requirement: 'Metal drip edge required at all eaves and rakes. Must extend minimum 2" back from edge and overlap at joints minimum 2".',
    warrantyImpact: 'Drip edge required for proper drainage and warranty compliance.',
    documentReference: 'GAF Shingle Installation Manual, Section 2.3 - Drip Edge Installation',
    defenseNote: 'GAF Installation Manual Section 2.3 requires metal drip edge at ALL eaves and rakes: "Install drip edge along the eave first, then along the rake. Overlap joints minimum 2 inches." This requirement aligns with IRC R905.2.8.5 and is necessary for warranty compliance.',
    relatedXactimateCodes: ['RFGDRIP', 'RFGDRIP+']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Deck Armor / Underlayment',
    requirement: 'GAF FeltBuster, Tiger Paw, or Deck Armor synthetic underlayment required over entire roof deck. Minimum 15 lb felt acceptable but synthetic preferred.',
    warrantyImpact: 'GAF Tiger Paw or Deck Armor required for enhanced warranty coverage.',
    documentReference: 'GAF Shingle Installation Manual, Section 3 - Underlayment',
    defenseNote: 'GAF installation instructions require approved underlayment over entire roof deck per Section 3. Synthetic underlayment (Tiger Paw, Deck Armor) recommended for enhanced warranty protection. Must reinstall to return property to pre-storm condition and maintain manufacturer warranty.',
    relatedXactimateCodes: ['RFGFELT15', 'RFGFELT30']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Valley Treatment',
    requirement: 'Open valleys require minimum 24" wide valley lining. Closed/woven valleys require 36" ice and water shield. Metal valley lining permitted with ice barrier beneath.',
    warrantyImpact: 'Improper valley treatment voids warranty in valley areas.',
    documentReference: 'GAF Shingle Installation Manual, Section 5 - Valley Application',
    defenseNote: 'GAF Installation Manual Section 5 specifies valley requirements: Open valleys require minimum 24" metal lining with ice barrier beneath. Closed/woven valleys require 36" ice and water shield per manufacturer instructions. Both methods require proper treatment for warranty compliance.',
    relatedXactimateCodes: ['RFGVMTL', 'RFGVMTLW', 'RFGIWS']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Ventilation',
    requirement: 'Proper attic ventilation required per GAF guidelines. Balanced intake/exhaust with minimum 1 sq ft NFA per 150 sq ft attic floor (or 1:300 with vapor barrier). Cobra ridge vent recommended.',
    warrantyImpact: 'Inadequate ventilation can void shingle warranty due to premature aging.',
    documentReference: 'GAF Ventilation Guide, Proper Attic Ventilation Requirements',
    defenseNote: 'GAF Ventilation Guide requires balanced attic ventilation with minimum 1 sq ft NFA per 150 sq ft attic floor. Inadequate ventilation causes premature shingle aging and VOIDS manufacturer warranty. Ridge vent provides balanced exhaust when combined with soffit intake per IRC R806.2.',
    relatedXactimateCodes: ['RFGVENTA', 'RFGVENTR', 'RFGVENTT']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Step Flashing',
    requirement: 'Step flashing required at all roof-to-wall intersections. Minimum 4" x 4" pieces with each shingle course. Counter flashing required over step flashing at masonry walls.',
    warrantyImpact: 'Improper flashing causes leaks not covered under warranty.',
    documentReference: 'GAF Shingle Installation Manual, Section 6 - Flashing',
    defenseNote: 'GAF Installation Manual Section 6 requires step flashing at ALL roof-to-wall intersections using minimum 4" x 4" pieces with each course. Counter flashing required over step flashing at masonry walls. Proper flashing is essential for weathertight assembly and warranty compliance.',
    relatedXactimateCodes: ['RFGSTEP', 'RFGSTEPC']
  },
  {
    manufacturer: 'GAF',
    product: 'All Shingle Products',
    component: 'Nailing Pattern',
    requirement: 'Standard wind zone: 4 nails per shingle. High wind zone (>110 mph): 6 nails per shingle. Nails must be placed per nailing guide printed on shingle.',
    warrantyImpact: 'Improper nailing pattern voids wind warranty coverage.',
    documentReference: 'GAF Shingle Installation Manual, Section 4.3 - Nailing Requirements',
    defenseNote: 'GAF requires specific nailing patterns per Installation Manual Section 4.3. High wind areas require 6 nails per shingle for warranty coverage. Proper nail placement on the nail line is critical - nails placed too high or too low void wind damage warranty.',
    relatedXactimateCodes: ['RFG300', 'RFG300S']
  }
]

// ============================================
// OWENS CORNING ROOFING PRODUCTS
// ============================================

export const OWENS_CORNING_REQUIREMENTS: ManufacturerRequirement[] = [
  {
    manufacturer: 'Owens Corning',
    product: 'Duration / TruDefinition Duration',
    component: 'Starter Strip',
    requirement: 'Owens Corning Starter Strip or equivalent peel-and-stick starter required at all eaves and rakes. Must provide sealant line for first course adhesion.',
    warrantyImpact: 'Required for Owens Corning System Warranty (Preferred, Platinum, Total Protection).',
    documentReference: 'Owens Corning Application Instructions, Starter Shingle Section',
    defenseNote: 'Owens Corning Application Instructions require starter strip shingles at ALL eaves and rakes to provide proper adhesive seal line for first course. This is a SYSTEM WARRANTY requirement. Failure to install proper starter strip voids Preferred/Platinum/Total Protection warranty coverage.',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+']
  },
  {
    manufacturer: 'Owens Corning',
    product: 'Duration / TruDefinition Duration',
    component: 'Ice & Water Shield (WeatherLock)',
    requirement: 'WeatherLock ice and water barrier required in valleys, at eaves in ice dam prone areas, around penetrations, and at low-slope transitions. Minimum 36" width in valleys.',
    warrantyImpact: 'Required for system warranty coverage in leak-prone areas.',
    documentReference: 'Owens Corning Application Instructions, Underlayment Section',
    defenseNote: 'Owens Corning WeatherLock ice barrier required per Application Instructions: "Apply ice and water barrier in valleys (minimum 36" wide), at eaves extending 24" past interior wall line, around all penetrations, and at roof-to-wall intersections." This is a warranty requirement.',
    relatedXactimateCodes: ['RFGIWS']
  },
  {
    manufacturer: 'Owens Corning',
    product: 'Duration / TruDefinition Duration',
    component: 'Hip and Ridge (DecoRidge)',
    requirement: 'DecoRidge or Hip & Ridge hip and ridge cap shingles required. Cut field shingles not approved for warranty coverage on Duration series.',
    warrantyImpact: 'Owens Corning hip & ridge cap required for system warranty.',
    documentReference: 'Owens Corning Application Instructions, Hip and Ridge Section',
    defenseNote: 'Owens Corning Application Instructions require DecoRidge or approved Hip & Ridge cap shingles. Cut 3-tab shingles are NOT approved for Duration series warranty coverage. Proper ridge cap required to maintain manufacturer warranty per IRC R904.1.',
    relatedXactimateCodes: ['RFGRIDGC']
  },
  {
    manufacturer: 'Owens Corning',
    product: 'All Shingle Products',
    component: 'Ventilation (VentSure)',
    requirement: 'Balanced attic ventilation required. Minimum NFA of 1 sq ft per 150 sq ft attic (1:300 with vapor barrier). VentSure products recommended for system warranty.',
    warrantyImpact: 'Inadequate ventilation voids shingle warranty due to heat damage.',
    documentReference: 'Owens Corning Ventilation Requirements',
    defenseNote: 'Owens Corning requires balanced attic ventilation with minimum 1:150 NFA ratio per Ventilation Requirements document. Improper ventilation causes premature shingle failure and VOIDS manufacturer warranty. Must include adequate ridge vent and soffit intake per IRC R806.2.',
    relatedXactimateCodes: ['RFGVENTA', 'RFGVENTR']
  },
  {
    manufacturer: 'Owens Corning',
    product: 'All Shingle Products',
    component: 'Drip Edge',
    requirement: 'Metal drip edge required at all eaves and rakes. Install at eave first (under underlayment), then at rake (over underlayment). Minimum 2" overlap at joints.',
    warrantyImpact: 'Drip edge required for proper installation and warranty.',
    documentReference: 'Owens Corning Application Instructions, Drip Edge Section',
    defenseNote: 'Owens Corning Application Instructions require metal drip edge at ALL eaves and rakes. Drip edge at eave installed UNDER underlayment; drip edge at rake installed OVER underlayment. This sequence is critical for proper drainage per manufacturer specs and IRC R905.2.8.5.',
    relatedXactimateCodes: ['RFGDRIP']
  },
  {
    manufacturer: 'Owens Corning',
    product: 'Duration FLEX',
    component: 'SureNail Technology',
    requirement: 'Duration FLEX shingles must be nailed through the SureNail strip (wide nailing zone). Nails outside the strip void wind warranty.',
    warrantyImpact: 'SureNail strip provides 130 MPH wind warranty when properly nailed.',
    documentReference: 'Owens Corning Duration FLEX Installation Guide',
    defenseNote: 'Duration FLEX features patented SureNail Technology requiring nails placed in the reinforced nailing zone for 130 MPH wind warranty. Improper nail placement voids enhanced wind coverage. This is a manufacturer-specific requirement.',
    relatedXactimateCodes: ['RFG300', 'RFG300S']
  }
]

// ============================================
// CERTAINTEED ROOFING PRODUCTS
// ============================================

export const CERTAINTEED_REQUIREMENTS: ManufacturerRequirement[] = [
  {
    manufacturer: 'CertainTeed',
    product: 'Landmark / Landmark PRO',
    component: 'Starter Strip (SwiftStart)',
    requirement: 'SwiftStart starter shingles required at all eaves and rakes. Provides factory-applied adhesive for first course seal.',
    warrantyImpact: 'Required for CertainTeed 5-Star and SureStart PLUS warranties.',
    documentReference: 'CertainTeed Shingle Applicators Manual, Chapter 4 - Starter Strip',
    defenseNote: 'CertainTeed Shingle Applicators Manual Chapter 4 requires SwiftStart or equivalent starter strip at ALL eaves and rakes: "Starter shingles are essential for proper adhesion of the first course and must be installed at all roof edges." Required for 5-Star warranty coverage.',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+']
  },
  {
    manufacturer: 'CertainTeed',
    product: 'Landmark / Landmark PRO',
    component: 'Ice & Water Shield (WinterGuard)',
    requirement: 'WinterGuard ice and water membrane required in valleys (36" min), at eaves (24" past wall), around penetrations, and at all critical areas.',
    warrantyImpact: 'WinterGuard required for watertight warranty in ice dam areas.',
    documentReference: 'CertainTeed Shingle Applicators Manual, Chapter 3 - Underlayments',
    defenseNote: 'CertainTeed Shingle Applicators Manual Chapter 3 requires WinterGuard ice barrier: "Install in valleys (minimum 36" wide), at eaves extending 24" past exterior wall line, and around all roof penetrations." This is required for leak-free warranty coverage.',
    relatedXactimateCodes: ['RFGIWS']
  },
  {
    manufacturer: 'CertainTeed',
    product: 'Landmark / Landmark PRO',
    component: 'Hip and Ridge (Shadow Ridge)',
    requirement: 'Shadow Ridge or Cedar Crest hip and ridge cap required. Cut field shingles not approved for Landmark series.',
    warrantyImpact: 'CertainTeed ridge cap required for Integrity Roof System warranty.',
    documentReference: 'CertainTeed Shingle Applicators Manual, Chapter 8 - Hip and Ridge',
    defenseNote: 'CertainTeed requires Shadow Ridge or Cedar Crest hip and ridge cap per Applicators Manual Chapter 8. Cut 3-tab or field shingles are NOT approved for Landmark series warranty coverage. Proper manufacturer-approved ridge cap required.',
    relatedXactimateCodes: ['RFGRIDGC']
  },
  {
    manufacturer: 'CertainTeed',
    product: 'All Shingle Products',
    component: 'Ventilation',
    requirement: 'Minimum ventilation of 1 sq ft NFA per 150 sq ft attic floor required. Balanced intake and exhaust essential. Ridge-A-Vent recommended.',
    warrantyImpact: 'Inadequate ventilation voids warranty - heat damage exclusion.',
    documentReference: 'CertainTeed Ventilation Guide',
    defenseNote: 'CertainTeed Ventilation Guide requires minimum 1:150 NFA ratio with balanced intake and exhaust. Per manufacturer: "Inadequate ventilation causes premature shingle deterioration and VOIDS warranty coverage under heat damage exclusion." Ridge vent required per IRC R806.2.',
    relatedXactimateCodes: ['RFGVENTA', 'RFGVENTR']
  },
  {
    manufacturer: 'CertainTeed',
    product: 'Presidential Shake',
    component: 'Special Installation',
    requirement: 'Presidential Shake requires minimum 5/12 pitch. Special starter course and installation pattern required. Hip and ridge must use Presidential Ridge cap.',
    warrantyImpact: 'Presidential products have specific requirements for premium warranty.',
    documentReference: 'CertainTeed Presidential Installation Instructions',
    defenseNote: 'CertainTeed Presidential Shake has specific installation requirements per manufacturer instructions: minimum 5/12 pitch, special starter application, and Presidential Ridge cap. These premium products require exact compliance for warranty.',
    relatedXactimateCodes: ['RFG300', 'RFGRIDGC']
  }
]

// ============================================
// ATLAS ROOFING PRODUCTS
// ============================================

export const ATLAS_REQUIREMENTS: ManufacturerRequirement[] = [
  {
    manufacturer: 'Atlas',
    product: 'StormMaster Slate / Pinnacle Pristine',
    component: 'Starter Strip',
    requirement: 'Atlas Pro-Cut Starter required at all eaves and rakes. Factory-cut starter provides proper exposure and adhesive line.',
    warrantyImpact: 'Required for Atlas Signature Select warranty.',
    documentReference: 'Atlas Roofing Application Instructions',
    defenseNote: 'Atlas Application Instructions require Pro-Cut Starter at ALL eaves and rakes for proper first course adhesion. Factory-cut starter ensures correct exposure and sealant alignment. Required for Signature Select warranty per IRC R904.1.',
    relatedXactimateCodes: ['RFGASTR', 'RFGASTR+']
  },
  {
    manufacturer: 'Atlas',
    product: 'StormMaster Slate',
    component: 'Scotchgard Protection',
    requirement: 'StormMaster Slate features Scotchgard algae protection. Replacement shingles must match to maintain uniform appearance and algae resistance.',
    warrantyImpact: 'Non-matching shingles void algae protection warranty.',
    documentReference: 'Atlas StormMaster Product Specifications',
    defenseNote: 'Atlas StormMaster Slate with Scotchgard protection requires Like Kind and Quality replacement to maintain algae resistance and uniform appearance. Non-matching shingles create aesthetic and functional inconsistency.',
    relatedXactimateCodes: ['RFG300', 'RFG300S']
  }
]

// ============================================
// MANUFACTURER WARRANTIES
// ============================================

export const MANUFACTURER_WARRANTIES: ManufacturerWarranty[] = [
  {
    manufacturer: 'GAF',
    warrantyType: 'Golden Pledge Limited Warranty',
    duration: '50 years (non-prorated first 10 years)',
    requirements: [
      'Must use GAF certified contractor',
      'Must use complete GAF roofing system',
      'Includes: Shingles, Starter Strip, Leak Barrier, Roof Deck Protection, Ridge Cap, Ridge Vent',
      'Proper installation per GAF specifications',
      'Adequate attic ventilation'
    ],
    voidConditions: [
      'Using non-GAF accessories',
      'Improper installation',
      'Inadequate ventilation',
      'Failure to follow nailing requirements',
      'Missing ice and water barrier where required',
      'Using cut 3-tab for hip/ridge'
    ]
  },
  {
    manufacturer: 'GAF',
    warrantyType: 'System Plus Limited Warranty',
    duration: '50 years (non-prorated first 10 years)',
    requirements: [
      'Must use minimum 3 GAF accessories',
      'GAF Certified Contractor not required',
      'Proper installation per specifications'
    ],
    voidConditions: [
      'Using fewer than 3 GAF accessories',
      'Improper installation',
      'Inadequate ventilation'
    ]
  },
  {
    manufacturer: 'Owens Corning',
    warrantyType: 'Total Protection Roofing System',
    duration: 'Lifetime (50 years for second owner)',
    requirements: [
      'Must use Owens Corning Preferred Contractor',
      'Complete system: Shingles, Hip & Ridge, Starter, Underlayment, Ventilation',
      'Proper installation per OC specifications'
    ],
    voidConditions: [
      'Non-OC components in system',
      'Improper ventilation',
      'Incorrect nailing pattern',
      'Missing required components'
    ]
  },
  {
    manufacturer: 'CertainTeed',
    warrantyType: '5-Star SureStart PLUS',
    duration: '50 years (non-prorated first 20 years)',
    requirements: [
      'Integrity Roof System installation',
      'CertainTeed SELECT ShingleMaster installer',
      'All CertainTeed accessories required'
    ],
    voidConditions: [
      'Non-CertainTeed accessories',
      'Non-certified installer',
      'Improper ventilation',
      'Installation defects'
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all requirements for a specific manufacturer
 */
export function getManufacturerRequirements(manufacturer: string): ManufacturerRequirement[] {
  const manufacturerLower = manufacturer.toLowerCase()
  
  if (manufacturerLower.includes('gaf')) {
    return GAF_REQUIREMENTS
  } else if (manufacturerLower.includes('owens') || manufacturerLower.includes('oc')) {
    return OWENS_CORNING_REQUIREMENTS
  } else if (manufacturerLower.includes('certainteed') || manufacturerLower.includes('certain')) {
    return CERTAINTEED_REQUIREMENTS
  } else if (manufacturerLower.includes('atlas')) {
    return ATLAS_REQUIREMENTS
  }
  
  return []
}

/**
 * Get requirement for a specific component across all manufacturers
 */
export function getComponentRequirements(component: string): ManufacturerRequirement[] {
  const componentLower = component.toLowerCase()
  const allRequirements = [
    ...GAF_REQUIREMENTS,
    ...OWENS_CORNING_REQUIREMENTS,
    ...CERTAINTEED_REQUIREMENTS,
    ...ATLAS_REQUIREMENTS
  ]
  
  return allRequirements.filter(req => 
    req.component.toLowerCase().includes(componentLower)
  )
}

/**
 * Get warranty information for a manufacturer
 */
export function getManufacturerWarranty(manufacturer: string): ManufacturerWarranty[] {
  return MANUFACTURER_WARRANTIES.filter(w => 
    w.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
  )
}

/**
 * Get defense note for manufacturer requirement
 */
export function getManufacturerDefenseNote(
  manufacturer: string, 
  component: string
): string | null {
  const requirements = getManufacturerRequirements(manufacturer)
  const req = requirements.find(r => 
    r.component.toLowerCase().includes(component.toLowerCase())
  )
  return req?.defenseNote || null
}

/**
 * Get all manufacturers that have requirements for an Xactimate code
 */
export function getManufacturersForXactimateCode(code: string): ManufacturerRequirement[] {
  const codeLower = code.toUpperCase()
  const allRequirements = [
    ...GAF_REQUIREMENTS,
    ...OWENS_CORNING_REQUIREMENTS,
    ...CERTAINTEED_REQUIREMENTS,
    ...ATLAS_REQUIREMENTS
  ]
  
  return allRequirements.filter(req => 
    req.relatedXactimateCodes.includes(codeLower)
  )
}
