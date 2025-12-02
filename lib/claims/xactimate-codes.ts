/**
 * Xactimate Code Reference
 * Common roofing line item codes used in insurance scopes
 * 
 * Based on industry research and carrier scope analysis
 */

export interface XactimateCode {
  code: string
  description: string
  category: string
  unit: string
  avgPrice?: number // Regional average, for reference only
  notes?: string
  ircCode?: string // Related IRC code if applicable
}

export const ROOFING_CODES: XactimateCode[] = [
  // Shingles - Tear Off
  {
    code: 'RFG250',
    description: 'Remove Composition shingles - 1 layer',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Standard tear-off, one layer'
  },
  {
    code: 'RFG260',
    description: 'Remove Composition shingles - 2 layers',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Tear-off with additional layer'
  },
  {
    code: 'RFG270',
    description: 'Remove Composition shingles - 3 layers',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Multiple layer tear-off'
  },

  // Shingles - Install
  {
    code: 'RFG300',
    description: 'Composition shingles - 3-tab 25yr',
    category: 'roofing',
    unit: 'SQ',
    notes: '3-tab shingles, basic'
  },
  {
    code: 'RFG310',
    description: 'Composition shingles - Laminated/Architectural 30yr',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Laminated/architectural shingles'
  },
  {
    code: 'RFG320',
    description: 'Composition shingles - Laminated/Architectural 40yr',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Premium laminated shingles'
  },
  {
    code: 'RFG330',
    description: 'Composition shingles - Laminated/Architectural 50yr',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Lifetime warranty shingles'
  },

  // Underlayment
  {
    code: 'RFG240',
    description: 'Roofing felt - 15 lb',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Standard felt underlayment'
  },
  {
    code: 'RFG241',
    description: 'Roofing felt - 30 lb',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Heavy felt underlayment'
  },
  {
    code: 'RFGSYN',
    description: 'Synthetic underlayment',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Synthetic felt alternative',
    ircCode: 'R905.2.7'
  },

  // Ice & Water Shield
  {
    code: 'RFGIWS',
    description: 'Ice & water shield membrane',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Self-adhering membrane for valleys and eaves',
    ircCode: 'R905.2.8.2'
  },

  // Drip Edge
  {
    code: 'RFGDRIP',
    description: 'Drip edge - aluminum',
    category: 'roofing',
    unit: 'LF',
    avgPrice: 2.77,
    notes: 'Required at eaves and rakes per code',
    ircCode: 'R905.2.8.5'
  },
  {
    code: 'RFGDRIPG',
    description: 'Drip edge - galvanized',
    category: 'roofing',
    unit: 'LF',
    notes: 'Galvanized steel drip edge'
  },

  // Starter Course
  {
    code: 'RFGSTRT',
    description: 'Asphalt starter - universal',
    category: 'roofing',
    unit: 'LF',
    notes: 'Pre-cut starter shingles',
    ircCode: 'R904.1'
  },
  {
    code: 'RFGSTRT3',
    description: 'Cut laminated shingle for starter',
    category: 'roofing',
    unit: 'LF',
    notes: 'Starter cut from field shingles'
  },

  // Hip & Ridge Cap
  {
    code: 'RFGRIDGC',
    description: 'Ridge cap - 3-tab cut',
    category: 'roofing',
    unit: 'LF',
    notes: 'Ridge cap cut from 3-tab shingles'
  },
  {
    code: 'RFGRIDGCS',
    description: 'Ridge cap - Standard profile laminated',
    category: 'roofing',
    unit: 'LF',
    notes: 'Factory hip/ridge cap for laminated shingles'
  },
  {
    code: 'RFGRIDGHP',
    description: 'Ridge cap - High profile laminated',
    category: 'roofing',
    unit: 'LF',
    notes: 'Premium hip/ridge cap'
  },

  // Flashing
  {
    code: 'RFGSTEP',
    description: 'Step flashing - aluminum',
    category: 'roofing',
    unit: 'LF',
    notes: 'Wall-to-roof transition flashing',
    ircCode: 'R905.2.8.3'
  },
  {
    code: 'RFGLFL',
    description: 'L-flashing - galvanized',
    category: 'roofing',
    unit: 'LF',
    notes: 'Wall flashing, L-shaped'
  },
  {
    code: 'RFGCHMFL',
    description: 'Chimney flashing - average',
    category: 'roofing',
    unit: 'EA',
    notes: 'Complete chimney flashing set'
  },
  {
    code: 'RFGVLYMT',
    description: 'Valley metal - W style',
    category: 'roofing',
    unit: 'LF',
    notes: 'Pre-formed valley metal',
    ircCode: 'R905.2.8.2'
  },
  {
    code: 'RFGCNTFL',
    description: 'Counter flashing - aluminum',
    category: 'roofing',
    unit: 'LF',
    notes: 'Counter flashing at walls/chimneys'
  },

  // Vents & Penetrations
  {
    code: 'RFGPJACK',
    description: 'Pipe jack/boot - standard',
    category: 'roofing',
    unit: 'EA',
    notes: 'Plumbing vent flashing boot'
  },
  {
    code: 'RFGPJSPL',
    description: 'Pipe jack/boot - split',
    category: 'roofing',
    unit: 'EA',
    notes: 'Split boot for electrical mast'
  },
  {
    code: 'RFGVENT',
    description: 'Roof vent - turtle/box type',
    category: 'roofing',
    unit: 'EA',
    notes: 'Standard static roof vent',
    ircCode: 'R806.2'
  },
  {
    code: 'RFGVNTRB',
    description: 'Roof vent - turbine',
    category: 'roofing',
    unit: 'EA',
    notes: 'Wind-powered turbine vent'
  },
  {
    code: 'RFGRIDGE',
    description: 'Ridge vent - shingle over',
    category: 'roofing',
    unit: 'LF',
    notes: 'Continuous ridge ventilation'
  },
  {
    code: 'RFGPWRV',
    description: 'Power vent - roof mounted',
    category: 'roofing',
    unit: 'EA',
    notes: 'Electric powered attic fan'
  },

  // Decking
  {
    code: 'RFGDECK',
    description: 'Plywood decking - 1/2"',
    category: 'roofing',
    unit: 'SF',
    notes: 'Roof sheathing replacement',
    ircCode: 'R905.2.1'
  },
  {
    code: 'RFGDECK58',
    description: 'Plywood decking - 5/8"',
    category: 'roofing',
    unit: 'SF',
    notes: 'Thicker sheathing for 24" rafters',
    ircCode: 'R803.1'
  },
  {
    code: 'RFGOSB',
    description: 'OSB decking - 7/16"',
    category: 'roofing',
    unit: 'SF',
    notes: 'OSB sheathing replacement'
  },

  // Steep Charges
  {
    code: 'RFGSTEEP',
    description: 'Additional charge for steep roof - 7/12 to 9/12',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Steep pitch labor addon'
  },
  {
    code: 'RFGSTEEP2',
    description: 'Additional charge for steep roof - 10/12 to 12/12',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Very steep pitch labor addon'
  },
  {
    code: 'RFGHIGH',
    description: 'Additional charge for 2-story',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Height/access labor addon'
  },

  // Labor
  {
    code: 'RFGLABR',
    description: 'Roofer - per hour',
    category: 'roofing',
    unit: 'HR',
    notes: 'General roofing labor'
  },
  {
    code: 'RFGSUPR',
    description: 'Residential Supervision/Project Management - per hour',
    category: 'roofing',
    unit: 'HR',
    notes: 'Supervisor time',
    ircCode: 'OSHA requirement for steep/high work'
  },

  // Additional Items
  {
    code: 'RFGDUMP',
    description: 'Debris removal - per load',
    category: 'roofing',
    unit: 'EA',
    notes: 'Dumpster and haul-off'
  },
  {
    code: 'RFGTARP',
    description: 'Tarp - all purpose poly - per sq',
    category: 'roofing',
    unit: 'SQ',
    notes: 'Property protection tarping'
  },
  {
    code: 'RFGSAFTY',
    description: 'Fall protection/harness - per day',
    category: 'roofing',
    unit: 'DA',
    notes: 'OSHA safety equipment'
  },
  {
    code: 'RFGSAT',
    description: 'Satellite dish - detach & reset',
    category: 'roofing',
    unit: 'EA',
    notes: 'Remove and reinstall satellite'
  },

  // Modified Bitumen / Flat Roof
  {
    code: 'RFGMOD',
    description: 'Modified bitumen roofing',
    category: 'roofing',
    unit: 'SQ',
    notes: 'For low-slope areas under 2/12',
    ircCode: 'R905.2.2'
  },

  // Cricket/Saddle
  {
    code: 'RFGCRKT',
    description: 'Cricket/saddle - metal',
    category: 'roofing',
    unit: 'EA',
    notes: 'Required for chimneys over 30" wide',
    ircCode: 'R903.2.2'
  },

  // Gutters (related)
  {
    code: 'GTRSEAM',
    description: 'Gutter - seamless aluminum',
    category: 'gutters',
    unit: 'LF',
    notes: 'Seamless gutters'
  },
  {
    code: 'GTRDR',
    description: 'Gutter detach & reset',
    category: 'gutters',
    unit: 'LF',
    notes: 'For drip edge installation'
  },
  {
    code: 'GTRSCR',
    description: 'Gutter screens - detach & reset',
    category: 'gutters',
    unit: 'LF',
    notes: 'Gutter guard handling'
  }
]

// Category groupings for UI display
export const CATEGORIES = [
  'roofing',
  'gutters',
  'painting',
  'siding',
  'drywall',
  'carpet',
  'interior',
  'electrical',
  'hvac',
  'other'
] as const

export type Category = typeof CATEGORIES[number]

// Common unit types
export const UNITS = {
  SQ: 'Square (100 sq ft)',
  LF: 'Linear Feet',
  SF: 'Square Feet',
  EA: 'Each',
  HR: 'Hour',
  DA: 'Day',
  BD: 'Bundle',
  RL: 'Roll'
} as const

/**
 * Look up Xactimate code by code string
 */
export function getXactimateCode(code: string): XactimateCode | undefined {
  return ROOFING_CODES.find(c => c.code.toUpperCase() === code.toUpperCase())
}

/**
 * Get all codes for a category
 */
export function getCodesByCategory(category: string): XactimateCode[] {
  return ROOFING_CODES.filter(c => c.category === category)
}

/**
 * Search codes by description
 */
export function searchCodes(query: string): XactimateCode[] {
  const q = query.toLowerCase()
  return ROOFING_CODES.filter(
    c => c.code.toLowerCase().includes(q) || 
         c.description.toLowerCase().includes(q)
  )
}

/**
 * Common items frequently missed in carrier scopes
 * Used for delta analysis
 */
export const COMMONLY_MISSED_ITEMS = [
  {
    code: 'RFGDRIP',
    name: 'Drip Edge',
    ircCode: 'R905.2.8.5',
    reason: 'Required at eaves and rake edges per code'
  },
  {
    code: 'RFGSTRT',
    name: 'Starter Course',
    ircCode: 'R904.1',
    reason: 'Required per manufacturer installation instructions'
  },
  {
    code: 'RFGIWS',
    name: 'Ice & Water Shield',
    ircCode: 'R905.2.8.2',
    reason: 'Required in valleys and at eaves in cold climates'
  },
  {
    code: 'RFGSTEP',
    name: 'Step Flashing',
    ircCode: 'R905.2.8.3',
    reason: 'Required at roof-to-wall intersections'
  },
  {
    code: 'RFGRIDGCS',
    name: 'Hip/Ridge Cap',
    ircCode: null,
    reason: 'Not included in waste calculations per EagleView'
  },
  {
    code: 'RFGSTEEP',
    name: 'Steep Charges',
    ircCode: null,
    reason: 'Required for pitches over 7/12'
  },
  {
    code: 'RFGHIGH',
    name: 'Two-Story/High Charges',
    ircCode: 'OSHA',
    reason: 'Additional labor for height and access'
  },
  {
    code: 'RFGSUPR',
    name: 'Supervision',
    ircCode: 'OSHA',
    reason: 'Required for steep or 2+ story work'
  },
  {
    code: 'RFGCRKT',
    name: 'Cricket/Saddle',
    ircCode: 'R903.2.2',
    reason: 'Required for chimneys/penetrations over 30" wide'
  },
  {
    code: 'RFGDECK',
    name: 'Decking Replacement',
    ircCode: 'R905.2.1',
    reason: 'Required when existing deck is damaged/not solidly sheathed'
  }
]
