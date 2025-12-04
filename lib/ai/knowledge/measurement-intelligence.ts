/**
 * Measurement Report Intelligence
 * 
 * Knowledge base for parsing and interpreting EagleView, HOVER, and other
 * aerial measurement reports. Critical for accurate supplement quantities.
 * 
 * IMPORTANT: Waste calculations from these reports do NOT include starter,
 * hip/ridge, or other accessories. This is documented on the reports themselves.
 */

export interface MeasurementField {
  fieldName: string
  commonLabels: string[]
  unit: string
  description: string
  xactimateCode: string | null
  notes: string
}

export interface PitchFactor {
  pitch: string
  multiplier: number
  steepCharge: string | null
}

export interface WasteRule {
  roofComplexity: 'simple' | 'moderate' | 'complex' | 'cut-up'
  wastePercentage: number
  description: string
  factors: string[]
}

// ============================================
// CRITICAL: WASTE CALCULATION RULES
// ============================================

export const WASTE_EXCLUSIONS = {
  disclaimer: 'Suggested waste percentages do NOT include hip and ridge cap or starter strip material.',
  excludedItems: [
    {
      item: 'Hip & Ridge Cap Shingles',
      reason: 'Must be added as separate line item - not in waste calculation',
      xactimateCode: 'RFGRIDGC',
      calculationSource: 'Hip LF + Ridge LF from measurement report'
    },
    {
      item: 'Starter Strip/Course',
      reason: 'Must be added as separate line item - not in waste calculation',
      xactimateCode: 'RFGASTR',
      calculationSource: 'Eaves LF + Rakes LF from measurement report'
    },
    {
      item: 'Ice & Water Shield',
      reason: 'Separate line item for valleys and eaves',
      xactimateCode: 'RFGIWS',
      calculationSource: 'Valley LF × 3ft width + Eaves LF × 2ft width'
    },
    {
      item: 'Valley Metal',
      reason: 'Separate line item for open valleys',
      xactimateCode: 'RFGVMTLW',
      calculationSource: 'Valley LF from measurement report'
    },
    {
      item: 'Drip Edge',
      reason: 'Separate line item required per IRC R905.2.8.5',
      xactimateCode: 'RFGDRIP',
      calculationSource: 'Eaves LF + Rakes LF from measurement report'
    },
    {
      item: 'Step Flashing',
      reason: 'Separate line item for wall intersections',
      xactimateCode: 'RFGSTEP',
      calculationSource: 'Measure wall intersections from photos'
    }
  ],
  defenseNote: 'EagleView/HOVER measurement report page [X] explicitly states: "Suggested waste percentages do NOT include hip and ridge cap or starter strip material." These items must be added as SEPARATE line items per the measurement report methodology.'
}

// ============================================
// PITCH FACTORS AND STEEP CHARGES
// ============================================

export const PITCH_FACTORS: PitchFactor[] = [
  { pitch: '0/12', multiplier: 1.000, steepCharge: null },
  { pitch: '1/12', multiplier: 1.003, steepCharge: null },
  { pitch: '2/12', multiplier: 1.014, steepCharge: null },
  { pitch: '3/12', multiplier: 1.031, steepCharge: null },
  { pitch: '4/12', multiplier: 1.054, steepCharge: null },
  { pitch: '5/12', multiplier: 1.083, steepCharge: null },
  { pitch: '6/12', multiplier: 1.118, steepCharge: null },
  { pitch: '7/12', multiplier: 1.158, steepCharge: 'RFGSTEEP' },
  { pitch: '8/12', multiplier: 1.202, steepCharge: 'RFGSTEEP' },
  { pitch: '9/12', multiplier: 1.250, steepCharge: 'RFGSTEEP' },
  { pitch: '10/12', multiplier: 1.302, steepCharge: 'RFGSTEEP+' },
  { pitch: '11/12', multiplier: 1.357, steepCharge: 'RFGSTEEP+' },
  { pitch: '12/12', multiplier: 1.414, steepCharge: 'RFGSTEEP+' },
  { pitch: '13/12', multiplier: 1.474, steepCharge: 'RFGSTEEP++' },
  { pitch: '14/12', multiplier: 1.537, steepCharge: 'RFGSTEEP++' },
  { pitch: '15/12', multiplier: 1.601, steepCharge: 'RFGSTEEP++' },
  { pitch: '16/12', multiplier: 1.667, steepCharge: 'RFGSTEEP++' }
]

export const STEEP_CHARGE_RULES = {
  'RFGSTEEP': {
    pitchRange: '7/12 to 9/12',
    description: 'Additional charge for steep roof',
    reason: 'Workers cannot safely walk on slopes above 7/12 without additional safety measures. Reduced productivity and increased labor time.',
    avgPrice: 56.27,
    unit: 'SQ'
  },
  'RFGSTEEP+': {
    pitchRange: '10/12 to 12/12',
    description: 'Additional charge for very steep roof',
    reason: 'Very steep pitch requires harness systems, toe boards, and specialized equipment. Significantly reduced productivity.',
    avgPrice: 88.44,
    unit: 'SQ'
  },
  'RFGSTEEP++': {
    pitchRange: 'Greater than 12/12',
    description: 'Additional charge for extreme steep roof',
    reason: 'Extreme pitch requires full safety staging, specialized equipment, and dramatically reduced productivity.',
    avgPrice: 114.88,
    unit: 'SQ'
  }
}

// ============================================
// WASTE CALCULATION GUIDELINES
// ============================================

export const WASTE_GUIDELINES: WasteRule[] = [
  {
    roofComplexity: 'simple',
    wastePercentage: 10,
    description: 'Simple gable or hip roof with minimal cuts',
    factors: [
      'Single ridge line',
      'Few or no dormers',
      'Minimal penetrations',
      'Regular shape'
    ]
  },
  {
    roofComplexity: 'moderate',
    wastePercentage: 12,
    description: 'Standard residential roof with some complexity',
    factors: [
      'Multiple roof planes',
      'Some valleys',
      'Several penetrations',
      '1-2 dormers'
    ]
  },
  {
    roofComplexity: 'complex',
    wastePercentage: 15,
    description: 'Complex roof with multiple features',
    factors: [
      'Multiple ridge lines',
      'Several valleys',
      'Multiple dormers',
      'Many penetrations',
      'Irregular shape'
    ]
  },
  {
    roofComplexity: 'cut-up',
    wastePercentage: 18,
    description: 'Highly complex cut-up roof',
    factors: [
      'Many small roof sections',
      'Numerous valleys and hips',
      'Multiple dormers',
      'Many angles and transitions',
      'Cathedral ceilings/skylights'
    ]
  }
]

// ============================================
// EAGLEVIEW REPORT FIELDS
// ============================================

export const EAGLEVIEW_FIELDS: MeasurementField[] = [
  // Primary Measurements
  {
    fieldName: 'Total Roof Area',
    commonLabels: ['Total Area', 'Roof Area', 'Total Roof Sq Ft'],
    unit: 'SF',
    description: 'Total roof surface area including pitch factor',
    xactimateCode: null,
    notes: 'Divide by 100 to get squares. This is the base for shingle quantity.'
  },
  {
    fieldName: 'Total Squares',
    commonLabels: ['Squares', 'Total Squares', 'Roof Squares'],
    unit: 'SQ',
    description: 'Total roofing squares (100 SF = 1 SQ)',
    xactimateCode: 'RFG300',
    notes: 'Primary quantity for shingle line items.'
  },
  {
    fieldName: 'Predominant Pitch',
    commonLabels: ['Pitch', 'Primary Pitch', 'Predominant Pitch'],
    unit: 'X/12',
    description: 'Main roof pitch angle',
    xactimateCode: null,
    notes: 'Determines steep charge applicability. 7/12+ = steep.'
  },
  
  // Linear Measurements
  {
    fieldName: 'Ridge Length',
    commonLabels: ['Ridge', 'Total Ridge', 'Ridge Length', 'Ridges'],
    unit: 'LF',
    description: 'Linear feet of ridge lines',
    xactimateCode: 'RFGRIDGC',
    notes: 'NOT included in waste. Add as separate hip/ridge cap line item.'
  },
  {
    fieldName: 'Hip Length',
    commonLabels: ['Hips', 'Total Hips', 'Hip Length'],
    unit: 'LF',
    description: 'Linear feet of hip lines',
    xactimateCode: 'RFGRIDGC',
    notes: 'NOT included in waste. Add to ridge for total hip/ridge cap.'
  },
  {
    fieldName: 'Valley Length',
    commonLabels: ['Valleys', 'Total Valleys', 'Valley Length'],
    unit: 'LF',
    description: 'Linear feet of valleys',
    xactimateCode: 'RFGVMTLW',
    notes: 'Use for valley metal and IWS calculations. IWS = Valley LF × 3 ft width.'
  },
  {
    fieldName: 'Eave Length',
    commonLabels: ['Eaves', 'Total Eaves', 'Eave Length', 'Eave Edge'],
    unit: 'LF',
    description: 'Linear feet of eave edges',
    xactimateCode: 'RFGDRIP',
    notes: 'Use for drip edge (eaves + rakes) and starter course calculations.'
  },
  {
    fieldName: 'Rake Length',
    commonLabels: ['Rakes', 'Total Rakes', 'Rake Length', 'Rake Edge'],
    unit: 'LF',
    description: 'Linear feet of rake edges',
    xactimateCode: 'RFGDRIP',
    notes: 'Add to eaves for total drip edge LF.'
  },
  {
    fieldName: 'Step Flashing Length',
    commonLabels: ['Step Flashing', 'Wall Flash', 'Sidewall'],
    unit: 'LF',
    description: 'Linear feet of roof-to-wall intersections',
    xactimateCode: 'RFGSTEP',
    notes: 'Use for step flashing line item. Verify with photos.'
  },
  
  // Area Measurements
  {
    fieldName: 'Flat Area',
    commonLabels: ['Flat', 'Flat Roof', 'Low Slope Area'],
    unit: 'SF',
    description: 'Area with slope less than 2/12',
    xactimateCode: 'RFGBI',
    notes: 'Requires modified bitumen or built-up roofing per IRC R905.2.2.'
  },
  
  // Count Measurements
  {
    fieldName: 'Number of Facets',
    commonLabels: ['Facets', 'Roof Facets', 'Planes'],
    unit: 'EA',
    description: 'Number of distinct roof planes',
    xactimateCode: null,
    notes: 'Higher facet count = more complexity = higher waste %.'
  },
  {
    fieldName: 'Penetrations',
    commonLabels: ['Penetrations', 'Pipe Boots', 'Vents'],
    unit: 'EA',
    description: 'Count of roof penetrations',
    xactimateCode: 'RFGFLPIPE',
    notes: 'Each penetration needs pipe jack or appropriate flashing.'
  }
]

// ============================================
// HOVER REPORT FIELDS
// ============================================

export const HOVER_FIELDS: MeasurementField[] = [
  {
    fieldName: 'Roof Square Footage',
    commonLabels: ['Roof Area', 'Total Roof SF'],
    unit: 'SF',
    description: 'Total roof surface area',
    xactimateCode: null,
    notes: 'HOVER may show both footprint and actual (pitched) area. Use pitched area.'
  },
  {
    fieldName: 'Ridge & Hip',
    commonLabels: ['Ridge/Hip', 'Combined Ridge Hip'],
    unit: 'LF',
    description: 'Combined ridge and hip length',
    xactimateCode: 'RFGRIDGC',
    notes: 'May be combined in HOVER. Use for hip/ridge cap.'
  },
  {
    fieldName: 'Drip Edge (Eave)',
    commonLabels: ['Eave Drip', 'Eave Length'],
    unit: 'LF',
    description: 'Eave edge length for drip edge',
    xactimateCode: 'RFGDRIP',
    notes: 'HOVER may separate eave and rake drip edge lengths.'
  },
  {
    fieldName: 'Drip Edge (Rake)',
    commonLabels: ['Rake Drip', 'Rake Length'],
    unit: 'LF',
    description: 'Rake edge length for drip edge',
    xactimateCode: 'RFGDRIP',
    notes: 'Add to eave drip for total drip edge.'
  },
  {
    fieldName: 'Valley',
    commonLabels: ['Valleys', 'Valley Length'],
    unit: 'LF',
    description: 'Valley length for metal and IWS',
    xactimateCode: 'RFGVMTLW',
    notes: 'Multiply by 3 for IWS SF in valleys.'
  },
  {
    fieldName: 'Step Flashing',
    commonLabels: ['Step Flash', 'Wall Intersection'],
    unit: 'LF',
    description: 'Roof-to-wall intersection length',
    xactimateCode: 'RFGSTEP',
    notes: 'Use for step flashing line item.'
  }
]

// ============================================
// QUANTITY CALCULATIONS
// ============================================

export interface QuantityCalculation {
  item: string
  formula: string
  example: string
  xactimateCode: string
}

export const QUANTITY_CALCULATIONS: QuantityCalculation[] = [
  {
    item: 'Shingles',
    formula: 'Total Squares from report × (1 + waste %)',
    example: '25 SQ × 1.12 (12% waste) = 28 SQ',
    xactimateCode: 'RFG300'
  },
  {
    item: 'Hip/Ridge Cap',
    formula: 'Ridge LF + Hip LF (NOT in waste)',
    example: '45 LF ridge + 60 LF hip = 105 LF',
    xactimateCode: 'RFGRIDGC'
  },
  {
    item: 'Starter Strip',
    formula: 'Eave LF + Rake LF (NOT in waste)',
    example: '150 LF eaves + 80 LF rakes = 230 LF',
    xactimateCode: 'RFGASTR'
  },
  {
    item: 'Drip Edge',
    formula: 'Eave LF + Rake LF',
    example: '150 LF eaves + 80 LF rakes = 230 LF',
    xactimateCode: 'RFGDRIP'
  },
  {
    item: 'Ice & Water Shield (Valleys)',
    formula: 'Valley LF × 3 ft width',
    example: '40 LF valleys × 3 ft = 120 SF',
    xactimateCode: 'RFGIWS'
  },
  {
    item: 'Ice & Water Shield (Eaves)',
    formula: 'Eave LF × 2 ft width (or 3 ft if extending past wall)',
    example: '150 LF eaves × 2 ft = 300 SF',
    xactimateCode: 'RFGIWS'
  },
  {
    item: 'Valley Metal',
    formula: 'Valley LF from report',
    example: '40 LF',
    xactimateCode: 'RFGVMTLW'
  },
  {
    item: 'Step Flashing',
    formula: 'Wall intersection LF from report or photos',
    example: '35 LF',
    xactimateCode: 'RFGSTEP'
  },
  {
    item: 'Ridge Vent',
    formula: 'Ridge LF (if ridge vent being installed)',
    example: '45 LF',
    xactimateCode: 'RFGVENTA'
  },
  {
    item: 'Underlayment',
    formula: 'Total Squares from report (same as shingle area)',
    example: '25 SQ',
    xactimateCode: 'RFGFELT15'
  },
  {
    item: 'Tear-off',
    formula: 'Total Squares (layers × squares if multiple layers)',
    example: '25 SQ single layer, 50 SQ if 2 layers',
    xactimateCode: 'RFGARMW+'
  },
  {
    item: 'Steep Charge',
    formula: 'Total Squares × steep charge (if pitch ≥ 7/12)',
    example: '25 SQ at 8/12 pitch = 25 SQ RFGSTEEP',
    xactimateCode: 'RFGSTEEP'
  },
  {
    item: 'High Charge',
    formula: 'Total Squares (if 2+ stories)',
    example: '25 SQ on 2-story = 25 SQ RFGHIGH+',
    xactimateCode: 'RFGHIGH+'
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get pitch factor multiplier
 */
export function getPitchFactor(pitch: string): number {
  const factor = PITCH_FACTORS.find(p => p.pitch === pitch)
  return factor?.multiplier || 1.0
}

/**
 * Determine steep charge code based on pitch
 */
export function getSteepChargeCode(pitch: string): string | null {
  const factor = PITCH_FACTORS.find(p => p.pitch === pitch)
  return factor?.steepCharge || null
}

/**
 * Calculate waste percentage based on roof complexity
 */
export function getWastePercentage(complexity: WasteRule['roofComplexity']): number {
  const rule = WASTE_GUIDELINES.find(w => w.roofComplexity === complexity)
  return rule?.wastePercentage || 12
}

/**
 * Parse pitch string to numeric value
 */
export function parsePitch(pitchString: string): number {
  const match = pitchString.match(/(\d+)\/12/)
  return match ? parseInt(match[1]) : 0
}

/**
 * Determine if pitch requires steep charge
 */
export function requiresSteepCharge(pitch: string): boolean {
  const pitchValue = parsePitch(pitch)
  return pitchValue >= 7
}

/**
 * Get measurement field info by name
 */
export function getMeasurementFieldInfo(fieldName: string): MeasurementField | undefined {
  const allFields = [...EAGLEVIEW_FIELDS, ...HOVER_FIELDS]
  return allFields.find(f => 
    f.fieldName.toLowerCase().includes(fieldName.toLowerCase()) ||
    f.commonLabels.some(l => l.toLowerCase().includes(fieldName.toLowerCase()))
  )
}

/**
 * Generate waste exclusion defense note
 */
export function getWasteExclusionDefenseNote(item: string): string {
  const excluded = WASTE_EXCLUSIONS.excludedItems.find(e => 
    e.item.toLowerCase().includes(item.toLowerCase())
  )
  if (excluded) {
    return `${excluded.item}: ${excluded.reason}. Calculate from: ${excluded.calculationSource}. Xactimate code: ${excluded.xactimateCode}.`
  }
  return WASTE_EXCLUSIONS.defenseNote
}

/**
 * Calculate recommended quantities from measurement data
 */
export function calculateQuantities(measurements: {
  totalSquares: number
  ridgeLF: number
  hipLF: number
  eaveLF: number
  rakeLF: number
  valleyLF: number
  stepFlashLF: number
  pitch: string
  stories: number
  complexity: WasteRule['roofComplexity']
}): Record<string, { quantity: number; unit: string; code: string }> {
  const wastePercent = getWastePercentage(measurements.complexity) / 100
  
  return {
    shingles: {
      quantity: Math.ceil(measurements.totalSquares * (1 + wastePercent)),
      unit: 'SQ',
      code: 'RFG300'
    },
    hipRidge: {
      quantity: measurements.ridgeLF + measurements.hipLF,
      unit: 'LF',
      code: 'RFGRIDGC'
    },
    starter: {
      quantity: measurements.eaveLF + measurements.rakeLF,
      unit: 'LF',
      code: 'RFGASTR'
    },
    dripEdge: {
      quantity: measurements.eaveLF + measurements.rakeLF,
      unit: 'LF',
      code: 'RFGDRIP'
    },
    valleyIWS: {
      quantity: measurements.valleyLF * 3,
      unit: 'SF',
      code: 'RFGIWS'
    },
    valleyMetal: {
      quantity: measurements.valleyLF,
      unit: 'LF',
      code: 'RFGVMTLW'
    },
    stepFlashing: {
      quantity: measurements.stepFlashLF,
      unit: 'LF',
      code: 'RFGSTEP'
    },
    steepCharge: requiresSteepCharge(measurements.pitch) ? {
      quantity: measurements.totalSquares,
      unit: 'SQ',
      code: getSteepChargeCode(measurements.pitch) || 'RFGSTEEP'
    } : { quantity: 0, unit: 'SQ', code: '' },
    highCharge: measurements.stories >= 2 ? {
      quantity: measurements.totalSquares,
      unit: 'SQ',
      code: 'RFGHIGH+'
    } : { quantity: 0, unit: 'SQ', code: '' }
  }
}
