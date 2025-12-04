/**
 * Regional Pricing Variations and O&P Justification Rules
 * 
 * Understanding pricing variations and when O&P is warranted is critical for
 * accurate estimates and successful supplement negotiations.
 */

export interface RegionalPricing {
  region: string
  states: string[]
  laborMultiplier: number
  materialMultiplier: number
  notes: string
}

export interface OPJustification {
  scenario: string
  warranted: boolean
  justification: string
  evidenceRequired: string[]
  defenseNote: string
}

export interface OPRule {
  carrier: string
  generalPolicy: string
  thresholds: string[]
  tips: string[]
}

export interface PriceListInfo {
  name: string
  coverage: string
  updateFrequency: string
  notes: string
}

// ============================================
// REGIONAL PRICING VARIATIONS
// ============================================

export const REGIONAL_PRICING: RegionalPricing[] = [
  // HIGH COST REGIONS
  {
    region: 'West Coast Metro',
    states: ['California (coastal)', 'Seattle area', 'Portland area'],
    laborMultiplier: 1.35,
    materialMultiplier: 1.15,
    notes: 'Highest labor costs in nation. Strong union presence. Higher material costs due to transportation and demand.'
  },
  {
    region: 'Northeast Metro',
    states: ['New York Metro', 'Boston', 'New Jersey', 'Connecticut'],
    laborMultiplier: 1.30,
    materialMultiplier: 1.12,
    notes: 'High labor costs, union influence. Seasonal constraints increase project costs.'
  },
  {
    region: 'Hawaii/Alaska',
    states: ['Hawaii', 'Alaska'],
    laborMultiplier: 1.40,
    materialMultiplier: 1.35,
    notes: 'Extreme material shipping costs. Limited contractor availability. Unique climate considerations.'
  },
  
  // MODERATE-HIGH COST REGIONS
  {
    region: 'Colorado Front Range',
    states: ['Denver Metro', 'Colorado Springs', 'Boulder'],
    laborMultiplier: 1.15,
    materialMultiplier: 1.08,
    notes: 'High demand from hail claims. Labor shortage in storm season. Mountain areas higher.'
  },
  {
    region: 'Texas Metro',
    states: ['DFW', 'Houston', 'Austin', 'San Antonio'],
    laborMultiplier: 1.05,
    materialMultiplier: 1.02,
    notes: 'Generally at or near national average. Surge pricing during storm season. Coastal areas slightly higher.'
  },
  {
    region: 'Florida',
    states: ['Florida (all)'],
    laborMultiplier: 1.12,
    materialMultiplier: 1.10,
    notes: 'Hurricane code compliance increases costs. Licensed contractor requirements. Material shortages after storms.'
  },
  
  // MODERATE COST REGIONS
  {
    region: 'Midwest',
    states: ['Illinois', 'Ohio', 'Michigan', 'Indiana', 'Wisconsin', 'Minnesota'],
    laborMultiplier: 1.00,
    materialMultiplier: 1.00,
    notes: 'Generally at national average. Chicago metro slightly higher. Rural areas slightly lower.'
  },
  {
    region: 'Southeast',
    states: ['Georgia', 'North Carolina', 'South Carolina', 'Tennessee', 'Alabama'],
    laborMultiplier: 0.95,
    materialMultiplier: 0.98,
    notes: 'Generally slightly below national average. Metro Atlanta near average.'
  },
  {
    region: 'Plains States',
    states: ['Oklahoma', 'Kansas', 'Nebraska', 'Iowa', 'Missouri'],
    laborMultiplier: 0.95,
    materialMultiplier: 0.97,
    notes: 'Below national average but surge during storm season. High hail frequency areas may see contractor shortage.'
  },
  
  // LOWER COST REGIONS
  {
    region: 'Rural South',
    states: ['Mississippi', 'Arkansas', 'Louisiana (non-coastal)', 'Rural Texas'],
    laborMultiplier: 0.88,
    materialMultiplier: 0.95,
    notes: 'Lower labor costs. Material delivery may add costs in remote areas.'
  },
  {
    region: 'Rural Midwest/Mountain',
    states: ['Montana', 'Wyoming', 'North Dakota', 'South Dakota', 'Rural areas'],
    laborMultiplier: 0.90,
    materialMultiplier: 1.05,
    notes: 'Lower labor but higher material transport costs. Limited contractor availability.'
  }
]

// ============================================
// XACTIMATE PRICE LIST INFORMATION
// ============================================

export const XACTIMATE_PRICE_LISTS: PriceListInfo[] = [
  {
    name: 'Xactimate Price List',
    coverage: 'Regional pricing by state/metro area',
    updateFrequency: 'Monthly updates',
    notes: 'Most carriers use Xactimate pricing. Verify correct price list is selected for job location and date.'
  },
  {
    name: 'State-Specific Lists',
    coverage: 'Each state has its own price list',
    updateFrequency: 'Monthly',
    notes: 'Select correct state. Some states have multiple lists (metro vs rural). Texas has TDI coastal list.'
  },
  {
    name: 'Metro Area Lists',
    coverage: 'Major metro areas have separate pricing',
    updateFrequency: 'Monthly',
    notes: 'DFW, Houston, Denver, etc. have specific metro pricing. Use metro list if job is in metro area.'
  }
]

// ============================================
// OVERHEAD & PROFIT JUSTIFICATION
// ============================================

export const OP_JUSTIFICATIONS: OPJustification[] = [
  // CLEARLY WARRANTED SCENARIOS
  {
    scenario: 'Multiple Trades Involved',
    warranted: true,
    justification: 'General contractor must coordinate scheduling, quality control, and communication between multiple trades.',
    evidenceRequired: [
      'Scope showing multiple trades (roofing, gutters, siding, interior, etc.)',
      'Documentation of coordination required',
      'Timeline showing overlapping work'
    ],
    defenseNote: 'Overhead and Profit warranted per industry standards when general contractor coordinates multiple trades. This project involves [roofing, gutters, siding, interior repairs, etc.] requiring scheduling coordination, quality oversight, and communication management between [X] separate trades.'
  },
  {
    scenario: 'Complex Project Management Required',
    warranted: true,
    justification: 'Project complexity requires dedicated management beyond standard single-trade work.',
    evidenceRequired: [
      'Photos documenting complexity (steep, high, cut-up, access issues)',
      'Safety plan requirements',
      'Permit and inspection coordination'
    ],
    defenseNote: 'Project complexity justifies Overhead and Profit. [Steep pitch/multi-story/complex geometry/limited access] requires project management, safety planning, and crew coordination beyond standard single-trade pricing. General contractor services are necessary for proper execution.'
  },
  {
    scenario: 'Steep Roof (7/12+)',
    warranted: true,
    justification: 'Steep roofs require enhanced safety planning, specialized equipment, and project management.',
    evidenceRequired: [
      'Pitch measurement documentation',
      'Photos showing steepness',
      'Safety equipment requirements'
    ],
    defenseNote: 'Roof pitch of [X]/12 requires enhanced project management for OSHA safety compliance. Steep roof work necessitates safety planning, equipment coordination, and crew supervision that constitutes general contractor overhead. O&P is standard for steep roof projects.'
  },
  {
    scenario: 'Two or More Stories',
    warranted: true,
    justification: 'Multi-story work requires additional material handling coordination and safety management.',
    evidenceRequired: [
      'Ground-level photos showing building height',
      'Documentation of stories/height'
    ],
    defenseNote: 'Multi-story structure ([X] stories) requires general contractor coordination for material handling logistics, fall protection compliance, and crew safety management. O&P is warranted for projects of this height and complexity.'
  },
  {
    scenario: 'Emergency/After-Hours Work',
    warranted: true,
    justification: 'Emergency response requires contractor coordination outside normal business operations.',
    evidenceRequired: [
      'Documentation of emergency circumstances',
      'Timeline showing expedited response'
    ],
    defenseNote: 'Emergency repair/tarping required immediate coordination and response outside normal business hours. Emergency project management services warrant Overhead and Profit.'
  },
  
  // SITUATIONALLY WARRANTED
  {
    scenario: 'Single Trade - Complex Roof',
    warranted: true,
    justification: 'Even single-trade projects may warrant O&P when significant complexity exists.',
    evidenceRequired: [
      'Documentation of complexity factors',
      'Multiple areas or phases',
      'Coordination requirements'
    ],
    defenseNote: 'While a single trade, this roofing project involves [multiple roof sections/phases/complex geometry/significant square footage] requiring project management services. Industry standards recognize O&P for complex single-trade projects.'
  },
  {
    scenario: 'Permit and Inspection Coordination',
    warranted: true,
    justification: 'Managing permit process and inspection scheduling is contractor overhead.',
    evidenceRequired: [
      'Permit documentation',
      'Inspection requirements',
      'Local jurisdiction requirements'
    ],
    defenseNote: 'Project requires permit acquisition and inspection coordination per [jurisdiction] requirements. Permit management, scheduling inspections, and ensuring code compliance are general contractor overhead services.'
  },
  
  // NOT TYPICALLY WARRANTED
  {
    scenario: 'Simple Single-Trade Repair',
    warranted: false,
    justification: 'Simple single-trade repairs without complexity factors typically do not warrant O&P.',
    evidenceRequired: [],
    defenseNote: 'Note: Simple repairs may not meet O&P thresholds. Document any complexity factors if O&P is being requested.'
  },
  {
    scenario: 'Walkable Low-Slope Single Story',
    warranted: false,
    justification: 'Low complexity single-story walkable roof typically handled by single crew without GC services.',
    evidenceRequired: [],
    defenseNote: 'Note: Low complexity work may require additional justification for O&P. Look for coordination, trades, or safety factors that elevate complexity.'
  }
]

// ============================================
// CARRIER-SPECIFIC O&P RULES
// ============================================

export const CARRIER_OP_RULES: OPRule[] = [
  {
    carrier: 'State Farm',
    generalPolicy: 'Generally pays O&P when 3+ trades involved or significant complexity documented.',
    thresholds: [
      'Three or more trades is typical threshold',
      'Complexity factors (steep, high, access) can justify with 2 trades',
      'Well-documented coordination requirements help approval'
    ],
    tips: [
      'Document all trades clearly in scope',
      'Include coordination timeline',
      'Reference specific complexity factors',
      'Provide photos showing complexity'
    ]
  },
  {
    carrier: 'Allstate',
    generalPolicy: 'Stricter on O&P than most carriers. Requires strong documentation.',
    thresholds: [
      'Typically wants 3+ trades with clear coordination need',
      'May require reinspection for complex projects',
      'Documentation-heavy approach'
    ],
    tips: [
      'Over-document everything',
      'Provide detailed coordination explanation',
      'Multiple trades must be clearly separate scopes',
      'Prepare for pushback and have evidence ready'
    ]
  },
  {
    carrier: 'USAA',
    generalPolicy: 'Generally fair on O&P when properly documented.',
    thresholds: [
      '2-3 trades with coordination typically approved',
      'Complexity factors recognized',
      'Reasonable with documentation'
    ],
    tips: [
      'Clear, concise documentation works well',
      'Code citations for complexity help',
      'Usually straightforward approval process'
    ]
  },
  {
    carrier: 'Farmers',
    generalPolicy: 'Variable by adjuster. Some regions more restrictive.',
    thresholds: [
      '3 trades is safe threshold',
      'May argue single-trade complexity',
      'Regional variation in approach'
    ],
    tips: [
      'Know your regional Farmers office tendencies',
      'Document trades and coordination clearly',
      'Be prepared for negotiation'
    ]
  },
  {
    carrier: 'Liberty Mutual',
    generalPolicy: 'Will pay O&P with proper justification.',
    thresholds: [
      'Multiple trades or significant complexity',
      'Responds to well-documented requests',
      'May question marginal cases'
    ],
    tips: [
      'Detailed scope breakdown helps',
      'Explain coordination requirements',
      'Include timeline of work phases'
    ]
  },
  {
    carrier: 'Nationwide',
    generalPolicy: 'Moderate approach to O&P.',
    thresholds: [
      '2-3 trades typically sufficient',
      'Recognizes complexity factors',
      'Generally reasonable'
    ],
    tips: [
      'Standard documentation usually sufficient',
      'Clear trade breakdown',
      'Note any complexity factors'
    ]
  }
]

// ============================================
// O&P CALCULATION
// ============================================

export const OP_CALCULATION = {
  standardRates: {
    overhead: 10,
    profit: 10,
    combined: 20
  },
  calculation: {
    method: 'O&P calculated on labor and materials, NOT on tax',
    formula: '(Labor + Materials) × 10% Overhead × 10% Profit',
    example: '$10,000 labor + materials: $1,000 overhead + $1,100 profit = $2,100 O&P'
  },
  commonIssues: [
    'Carriers calculating O&P on reduced amounts',
    'Excluding certain line items from O&P base',
    'Applying O&P before adding all items',
    'Not including O&P on supplement items'
  ],
  defenseNote: 'Overhead and Profit is industry standard at 10% overhead and 10% profit applied to the labor and material costs. This represents the general contractor business costs for managing multi-trade or complex projects. O&P should be calculated on the full scope including all supplement items.'
}

// ============================================
// SURGE PRICING KNOWLEDGE
// ============================================

export const SURGE_PRICING = {
  triggers: [
    'Major storm events (hurricane, large hail outbreak)',
    'High volume of claims in area',
    'Material shortages',
    'Labor shortages from demand spike'
  ],
  affectedCosts: [
    'Labor rates may increase 10-25% during surge',
    'Material costs may increase 15-30%',
    'Delivery times extend',
    'Subcontractor availability decreases'
  ],
  documentation: [
    'Date stamps on quotes showing timing',
    'Supplier communications about shortages',
    'News coverage of storm event',
    'Industry publications about market conditions'
  ],
  defenseNote: 'Material and labor costs are subject to market conditions. Following the [storm event] on [date], regional pricing has increased due to demand surge. Current pricing reflects actual market conditions at time of repair, not pre-storm rates. Xactimate pricing is updated monthly to reflect these changes.'
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get regional pricing multiplier
 */
export function getRegionalPricing(state: string): RegionalPricing | undefined {
  return REGIONAL_PRICING.find(r => 
    r.states.some(s => s.toLowerCase().includes(state.toLowerCase()))
  )
}

/**
 * Check if O&P is warranted for a scenario
 */
export function isOPWarranted(scenario: string): OPJustification | undefined {
  return OP_JUSTIFICATIONS.find(j => 
    j.scenario.toLowerCase().includes(scenario.toLowerCase()) ||
    scenario.toLowerCase().includes(j.scenario.toLowerCase())
  )
}

/**
 * Get carrier-specific O&P rules
 */
export function getCarrierOPRules(carrier: string): OPRule | undefined {
  return CARRIER_OP_RULES.find(r => 
    r.carrier.toLowerCase().includes(carrier.toLowerCase())
  )
}

/**
 * Calculate O&P amount
 */
export function calculateOP(laborAndMaterials: number): {
  overhead: number
  profit: number
  total: number
} {
  const overhead = laborAndMaterials * 0.10
  const profit = (laborAndMaterials + overhead) * 0.10
  return {
    overhead,
    profit,
    total: overhead + profit
  }
}

/**
 * Get O&P defense note for scenario
 */
export function getOPDefenseNote(scenario: string, trades: string[]): string {
  const tradesCount = trades.length
  const tradesStr = trades.join(', ')
  
  if (tradesCount >= 3) {
    return `Overhead and Profit warranted per industry standards. This project involves ${tradesCount} separate trades (${tradesStr}) requiring general contractor coordination, scheduling, quality control, and communication management. O&P at standard 10%/10% is appropriate for multi-trade projects.`
  } else if (tradesCount === 2) {
    return `Overhead and Profit warranted due to multi-trade coordination requirements. Project involves ${tradesStr} requiring scheduling coordination and quality oversight. Additional complexity factors [steep/high/access] further justify GC services.`
  } else {
    return `Overhead and Profit may be warranted based on project complexity. Document specific factors requiring general contractor management services: [complexity factors].`
  }
}

/**
 * Get all O&P justifications that are warranted
 */
export function getWarrantedOPScenarios(): OPJustification[] {
  return OP_JUSTIFICATIONS.filter(j => j.warranted)
}
