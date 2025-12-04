/**
 * Depreciation Knowledge Base
 * 
 * Understanding how carriers calculate depreciation is critical for:
 * 1. Verifying carrier depreciation calculations are correct
 * 2. Challenging excessive depreciation
 * 3. Tracking recoverable vs non-recoverable depreciation
 * 4. Understanding ACV vs RCV policy differences
 */

export interface MaterialLifeExpectancy {
  material: string
  category: string
  expectedLife: number // years
  depreciationRate: number // % per year
  factors: string[]
  notes: string
}

export interface DepreciationMethod {
  method: string
  description: string
  formula: string
  commonCarriers: string[]
  example: string
}

export interface PolicyType {
  type: 'RCV' | 'ACV' | 'RCV_HOLDBACK' | 'FUNCTIONAL'
  name: string
  description: string
  depreciationHandling: string
  recoverability: string
  commonIssues: string[]
}

// ============================================
// MATERIAL LIFE EXPECTANCY TABLES
// ============================================

export const ROOFING_LIFE_EXPECTANCY: MaterialLifeExpectancy[] = [
  // COMPOSITION SHINGLES
  {
    material: '3-Tab Composition Shingles',
    category: 'shingles',
    expectedLife: 20,
    depreciationRate: 5,
    factors: ['Climate', 'Ventilation', 'Installation quality', 'Color (dark absorbs more heat)'],
    notes: 'Standard 3-tab 25-year shingles typically have 20-year actual life. Depreciation is linear at ~5% per year.'
  },
  {
    material: 'Architectural/Laminated Shingles (30-year)',
    category: 'shingles',
    expectedLife: 25,
    depreciationRate: 4,
    factors: ['Climate', 'Ventilation', 'Installation quality', 'Manufacturer'],
    notes: '30-year rated shingles typically last 25 years. Better quality justifies lower depreciation rate.'
  },
  {
    material: 'Architectural/Laminated Shingles (50-year/Lifetime)',
    category: 'shingles',
    expectedLife: 30,
    depreciationRate: 3.33,
    factors: ['Climate', 'Ventilation', 'Installation quality', 'Premium materials'],
    notes: 'Premium lifetime shingles may last 30+ years with proper installation and ventilation.'
  },
  {
    material: 'Designer/Premium Shingles',
    category: 'shingles',
    expectedLife: 35,
    depreciationRate: 2.86,
    factors: ['Premium materials', 'Installation quality', 'Manufacturer warranty'],
    notes: 'GAF Grand Canyon, OC Berkshire, etc. Premium products with extended life expectancy.'
  },

  // METAL ROOFING
  {
    material: 'Standing Seam Metal',
    category: 'metal',
    expectedLife: 50,
    depreciationRate: 2,
    factors: ['Material gauge', 'Coating type', 'Installation quality'],
    notes: 'Standing seam metal can last 50+ years with minimal maintenance.'
  },
  {
    material: 'Metal Shingles',
    category: 'metal',
    expectedLife: 40,
    depreciationRate: 2.5,
    factors: ['Material quality', 'Coating', 'Fastener type'],
    notes: 'Stone-coated steel and aluminum shingles have excellent longevity.'
  },
  {
    material: 'Corrugated Metal',
    category: 'metal',
    expectedLife: 30,
    depreciationRate: 3.33,
    factors: ['Gauge', 'Coating', 'Fastener exposure'],
    notes: 'Exposed fastener metal roofing requires periodic maintenance.'
  },

  // TILE AND SLATE
  {
    material: 'Clay Tile',
    category: 'tile',
    expectedLife: 75,
    depreciationRate: 1.33,
    factors: ['Quality of tile', 'Underlayment condition', 'Fastening'],
    notes: 'Clay tile can last 75-100 years. Underlayment typically fails before tile.'
  },
  {
    material: 'Concrete Tile',
    category: 'tile',
    expectedLife: 50,
    depreciationRate: 2,
    factors: ['Quality', 'Sealant condition', 'Climate'],
    notes: 'Concrete tile is durable but more susceptible to moisture than clay.'
  },
  {
    material: 'Natural Slate',
    category: 'slate',
    expectedLife: 100,
    depreciationRate: 1,
    factors: ['Slate quality (hard vs soft)', 'Fastener condition'],
    notes: 'High-quality hard slate can last 100+ years. Soft slate may only last 50 years.'
  },

  // FLAT ROOFING
  {
    material: 'Modified Bitumen',
    category: 'flat',
    expectedLife: 20,
    depreciationRate: 5,
    factors: ['UV exposure', 'Ponding water', 'Installation quality'],
    notes: 'Modified bitumen systems typically last 15-20 years.'
  },
  {
    material: 'Built-Up Roofing (BUR)',
    category: 'flat',
    expectedLife: 25,
    depreciationRate: 4,
    factors: ['Number of plies', 'Surfacing', 'Maintenance'],
    notes: 'Multi-ply BUR can last 25-30 years with proper maintenance.'
  },
  {
    material: 'TPO/PVC Membrane',
    category: 'flat',
    expectedLife: 25,
    depreciationRate: 4,
    factors: ['Membrane thickness', 'UV exposure', 'Seam integrity'],
    notes: 'Single-ply membranes typically last 20-25 years.'
  },
  {
    material: 'EPDM Rubber',
    category: 'flat',
    expectedLife: 20,
    depreciationRate: 5,
    factors: ['Thickness', 'Seam condition', 'UV exposure'],
    notes: 'EPDM typically lasts 15-20 years. Prone to shrinkage over time.'
  },

  // COMPONENTS
  {
    material: 'Pipe Jacks/Boots',
    category: 'components',
    expectedLife: 15,
    depreciationRate: 6.67,
    factors: ['UV exposure', 'Temperature cycles', 'Material quality'],
    notes: 'Rubber boots degrade faster than shingles - often first point of failure.'
  },
  {
    material: 'Drip Edge',
    category: 'components',
    expectedLife: 30,
    depreciationRate: 3.33,
    factors: ['Material (aluminum vs steel)', 'Coastal exposure'],
    notes: 'Aluminum drip edge typically outlasts shingles. Steel may rust.'
  },
  {
    material: 'Valley Metal',
    category: 'components',
    expectedLife: 30,
    depreciationRate: 3.33,
    factors: ['Material type', 'Water flow volume', 'Debris accumulation'],
    notes: 'Valley metal life depends on material - aluminum and copper last longest.'
  },
  {
    material: 'Ridge Vent',
    category: 'components',
    expectedLife: 20,
    depreciationRate: 5,
    factors: ['Material quality', 'Baffles', 'UV exposure'],
    notes: 'Ridge vent typically depreciates at same rate as shingles.'
  },
  {
    material: 'Gutters (Aluminum)',
    category: 'gutters',
    expectedLife: 25,
    depreciationRate: 4,
    factors: ['Gauge', 'Installation', 'Maintenance'],
    notes: 'Seamless aluminum gutters last 20-25 years with proper maintenance.'
  }
]

// ============================================
// DEPRECIATION METHODS
// ============================================

export const DEPRECIATION_METHODS: DepreciationMethod[] = [
  {
    method: 'Straight-Line Depreciation',
    description: 'Most common method. Depreciates material value evenly over expected life.',
    formula: 'Depreciation = (Age ÷ Expected Life) × RCV',
    commonCarriers: ['State Farm', 'Allstate', 'USAA', 'Farmers'],
    example: '10-year-old 20-year shingle: 10/20 = 50% depreciated. $10,000 RCV × 50% = $5,000 depreciation. ACV = $5,000.'
  },
  {
    method: 'Declining Balance',
    description: 'Higher depreciation in early years, lower in later years.',
    formula: 'Annual Depreciation = Book Value × Depreciation Rate',
    commonCarriers: ['Some regional carriers'],
    example: 'Less common for roofing but may be used for some equipment.'
  },
  {
    method: 'Observed Condition',
    description: 'Adjuster assesses actual condition rather than pure age-based calculation.',
    formula: 'Subjective assessment based on physical inspection',
    commonCarriers: ['Liberty Mutual', 'Some specialty carriers'],
    example: 'Well-maintained 15-year roof may depreciate less than formula suggests.'
  },
  {
    method: 'Age/Life Table',
    description: 'Uses standardized tables matching material to expected life.',
    formula: 'Lookup table based on material type and age',
    commonCarriers: ['State Farm', 'Nationwide'],
    example: '3-tab shingles with 20-year life at age 8 = 40% depreciated per table.'
  }
]

// ============================================
// POLICY TYPES AND DEPRECIATION
// ============================================

export const POLICY_TYPES: PolicyType[] = [
  {
    type: 'RCV',
    name: 'Replacement Cost Value',
    description: 'Pays full cost to replace damaged property with similar materials. Depreciation is withheld initially but recoverable upon completion.',
    depreciationHandling: 'Depreciation withheld from initial payment but RECOVERABLE after repairs completed.',
    recoverability: 'RECOVERABLE - Homeowner receives depreciation back after work is completed and documented.',
    commonIssues: [
      'Carrier delays releasing recoverable depreciation',
      'Carrier requires proof of completion before releasing',
      'Time limits on recovering depreciation (typically 180 days to 1 year)',
      'Some carriers require contractor invoice showing full amount paid'
    ]
  },
  {
    type: 'ACV',
    name: 'Actual Cash Value',
    description: 'Pays the depreciated value of damaged property. No recoverable depreciation.',
    depreciationHandling: 'Depreciation is permanently deducted. Homeowner receives only ACV.',
    recoverability: 'NON-RECOVERABLE - Depreciation is a permanent deduction from claim payment.',
    commonIssues: [
      'Homeowner must pay difference between ACV and actual repair cost',
      'Often results in significantly less claim payment',
      'Common in older policies or lower-premium options',
      'Carrier depreciation calculations may be excessive'
    ]
  },
  {
    type: 'RCV_HOLDBACK',
    name: 'RCV with Holdback',
    description: 'RCV policy that withholds recoverable depreciation until repairs are complete.',
    depreciationHandling: 'Initial payment = ACV. Recoverable depreciation paid after repairs documented.',
    recoverability: 'RECOVERABLE upon proof of repair completion.',
    commonIssues: [
      'Confusion about what "completion" means',
      'Carriers may require specific documentation',
      'Time limits for depreciation recovery',
      'Some require contractor invoice, others accept photos'
    ]
  },
  {
    type: 'FUNCTIONAL',
    name: 'Functional Replacement Cost',
    description: 'Pays cost of functional replacement, not necessarily matching materials.',
    depreciationHandling: 'May use cheaper modern equivalents rather than LKQ replacement.',
    recoverability: 'Limited - pays for functional replacement only.',
    commonIssues: [
      'May not pay for exact matching materials',
      'Common issue with discontinued materials',
      'May require arguing LKQ for matching'
    ]
  }
]

// ============================================
// DEPRECIATION RECOVERY
// ============================================

export const DEPRECIATION_RECOVERY = {
  typicalProcess: [
    '1. Initial claim paid at ACV (RCV minus depreciation minus deductible)',
    '2. Contractor completes repairs',
    '3. Homeowner submits proof of completion (invoice, photos, certificate)',
    '4. Carrier releases recoverable depreciation (RCV - ACV previously paid)',
    '5. Homeowner receives final payment for depreciation'
  ],
  requiredDocumentation: [
    'Final invoice from contractor showing work completed',
    'Photos of completed work',
    'Certificate of Completion (COC) in some cases',
    'Proof that full invoiced amount was paid',
    'Building permit sign-off (if applicable)'
  ],
  timeframes: {
    typical: '180 days to 1 year from claim date',
    state_variations: 'Some states require longer recovery windows',
    extensions: 'Most carriers will grant extensions if requested in writing'
  },
  defenseNote: 'Recoverable depreciation must be paid upon proof of repair completion per policy terms. If carrier delays or denies recoverable depreciation after documented completion, this may constitute bad faith claim handling.'
}

// ============================================
// CHALLENGING DEPRECIATION
// ============================================

export const DEPRECIATION_CHALLENGES = {
  excessiveDepreciation: {
    indicators: [
      'Depreciation percentage exceeds age/life ratio',
      'Materials depreciated beyond actual condition',
      'Brand-new components (pipe jacks, drip edge) depreciated',
      'Labor depreciated (labor does not depreciate)',
      'Overhead and Profit depreciated (should not be)'
    ],
    defenseStrategies: [
      'Request carrier provide depreciation methodology',
      'Compare to industry-standard life expectancy tables',
      'Document actual material condition with photos',
      'Argue new components should not be depreciated',
      'Verify labor and O&P are not being depreciated'
    ]
  },
  laborDepreciation: {
    rule: 'LABOR DOES NOT DEPRECIATE',
    explanation: 'Labor represents current cost of work - there is no "used" labor. Only materials can depreciate.',
    defenseNote: 'Labor costs do not depreciate. Current labor rates reflect current market costs for work to be performed. If carrier has depreciated labor, request correction.'
  },
  opDepreciation: {
    rule: 'O&P SHOULD NOT BE DEPRECIATED',
    explanation: 'Overhead and Profit are current business costs, not material values.',
    defenseNote: 'Overhead and Profit represent current business expenses and should not be subject to depreciation. These are costs of doing business today, not historical material values.'
  },
  newComponents: {
    rule: 'NEW COMPONENTS REPLACING OLD SHOULD NOT BE OVER-DEPRECIATED',
    explanation: 'Components like pipe jacks that are always replaced with new should reflect minimal depreciation.',
    defenseNote: 'Pipe jacks, boots, and similar components are always replaced with new products regardless of age. These items should not be depreciated at same rate as roof surface materials.'
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate depreciation for a material
 */
export function calculateDepreciation(
  material: string,
  ageYears: number,
  rcv: number
): { depreciation: number; acv: number; percentage: number } {
  const materialInfo = ROOFING_LIFE_EXPECTANCY.find(m => 
    m.material.toLowerCase().includes(material.toLowerCase())
  )
  
  if (!materialInfo) {
    // Default to 20-year life if material not found
    const percentage = Math.min((ageYears / 20) * 100, 100)
    const depreciation = rcv * (percentage / 100)
    return {
      depreciation,
      acv: rcv - depreciation,
      percentage
    }
  }
  
  const percentage = Math.min((ageYears / materialInfo.expectedLife) * 100, 100)
  const depreciation = rcv * (percentage / 100)
  
  return {
    depreciation,
    acv: rcv - depreciation,
    percentage
  }
}

/**
 * Get life expectancy for a material
 */
export function getMaterialLifeExpectancy(material: string): MaterialLifeExpectancy | undefined {
  return ROOFING_LIFE_EXPECTANCY.find(m => 
    m.material.toLowerCase().includes(material.toLowerCase())
  )
}

/**
 * Check if depreciation amount seems excessive
 */
export function isDepreciationExcessive(
  ageYears: number,
  expectedLife: number,
  actualDepreciationPercent: number
): { excessive: boolean; expectedPercent: number; difference: number } {
  const expectedPercent = Math.min((ageYears / expectedLife) * 100, 100)
  const difference = actualDepreciationPercent - expectedPercent
  
  return {
    excessive: difference > 10, // More than 10% over expected is excessive
    expectedPercent,
    difference
  }
}

/**
 * Get policy type information
 */
export function getPolicyTypeInfo(type: string): PolicyType | undefined {
  return POLICY_TYPES.find(p => 
    p.type.toLowerCase() === type.toLowerCase() ||
    p.name.toLowerCase().includes(type.toLowerCase())
  )
}

/**
 * Generate defense note for depreciation challenge
 */
export function getDepreciationDefenseNote(issue: 'labor' | 'op' | 'excessive' | 'new_components'): string {
  switch (issue) {
    case 'labor':
      return DEPRECIATION_CHALLENGES.laborDepreciation.defenseNote
    case 'op':
      return DEPRECIATION_CHALLENGES.opDepreciation.defenseNote
    case 'excessive':
      return 'Carrier depreciation calculation exceeds industry-standard age/life methodology. Request carrier provide detailed depreciation methodology and compare to standard material life expectancy tables.'
    case 'new_components':
      return DEPRECIATION_CHALLENGES.newComponents.defenseNote
    default:
      return ''
  }
}
