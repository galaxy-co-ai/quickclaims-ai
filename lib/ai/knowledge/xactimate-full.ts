/**
 * Complete Xactimate Code Reference
 * 
 * Based on real-world RISE Roofing supplement documentation.
 * Prices are regional estimates and should be verified against local price lists.
 */

export interface XactimateLineItem {
  code: string
  description: string
  unit: 'SQ' | 'LF' | 'SF' | 'EA' | 'HR' | 'DA' | 'RL' | 'BD'
  avgPrice: number
  category: string
  ircCode?: string
  manufacturerRef?: string
  defenseNote?: string
}

export const XACTIMATE_CODES: XactimateLineItem[] = [
  // ==========================================
  // LABOR
  // ==========================================
  {
    code: 'LABRFG',
    description: 'Roofer - per hour',
    unit: 'HR',
    avgPrice: 127.28,
    category: 'labor',
    defenseNote: 'Additional labor required for [specific task]. Standard roofer hourly rate per Xactimate price list.'
  },
  {
    code: 'LABRFG-M',
    description: 'Membrane Roofing Installer - per hour',
    unit: 'HR',
    avgPrice: 98.95,
    category: 'labor',
    defenseNote: 'Specialized membrane installer required for flat/low-slope sections per manufacturer specifications.'
  },

  // ==========================================
  // SHINGLES - REMOVAL
  // ==========================================
  {
    code: 'RFGARMW',
    description: 'Tear off haul and dispose - Comp. shingles - 3 tab',
    unit: 'SQ',
    avgPrice: 59.40,
    category: 'removal',
    defenseNote: 'Complete tear-off, haul, and disposal of existing 3-tab shingles.'
  },
  {
    code: 'RFGARMW+',
    description: 'Tear off haul and dispose of comp. shingles - Laminated',
    unit: 'SQ',
    avgPrice: 61.20,
    category: 'removal',
    defenseNote: 'Laminated shingles require additional labor for tear-off due to increased weight and adhesion.'
  },
  {
    code: 'RFGARMVN',
    description: 'Tear off composition shingles - 3 tab (no haul off)',
    unit: 'SQ',
    avgPrice: 41.05,
    category: 'removal'
  },
  {
    code: 'RFGADDRMV',
    description: 'Add. layer of comp. shingles remove & disp. - 3 tab',
    unit: 'SQ',
    avgPrice: 37.16,
    category: 'removal',
    defenseNote: 'Additional layer removal required. Document extra crew hours with photo proof.'
  },

  // ==========================================
  // SHINGLES - INSTALLATION
  // ==========================================
  {
    code: 'RFG240',
    description: '3 tab - 25 yr. - composition shingle roofing - incl. felt',
    unit: 'SQ',
    avgPrice: 328.33,
    category: 'shingles'
  },
  {
    code: 'RFG240S',
    description: '3 tab - 25 yr - comp. shingle roofing - w/out felt',
    unit: 'SQ',
    avgPrice: 294.42,
    category: 'shingles'
  },
  {
    code: 'RFG300',
    description: '3 tab - 25 yr - comp. shingle rfg - w/ felt',
    unit: 'SQ',
    avgPrice: 357.24,
    category: 'shingles'
  },
  {
    code: 'RFG300S',
    description: 'Laminated - comp. shingle rfg - w/out felt',
    unit: 'SQ',
    avgPrice: 321.04,
    category: 'shingles'
  },
  {
    code: 'RFG240E',
    description: '3 tab - 25 yr. - composition shingle roofing (per SHINGLE)',
    unit: 'EA',
    avgPrice: 23.60,
    category: 'shingles'
  },
  {
    code: 'RFG400E',
    description: 'Laminated - High grade - comp. shingle rfg. (per SHINGLE)',
    unit: 'EA',
    avgPrice: 25.08,
    category: 'shingles'
  },

  // ==========================================
  // UNDERLAYMENT & BARRIERS
  // ==========================================
  {
    code: 'RFGFELT15',
    description: 'Roofing felt - 15 lb.',
    unit: 'SQ',
    avgPrice: 35.62,
    category: 'underlayment',
    ircCode: 'R905.2.7',
    defenseNote: 'Underlayment required per IRC R905.2.7. Shingles must be applied over approved underlayment.'
  },
  {
    code: 'RFGFELT30',
    description: 'Roofing felt - 30 lb.',
    unit: 'SQ',
    avgPrice: 44.20,
    category: 'underlayment',
    ircCode: 'R905.2.7',
    defenseNote: '30 lb. felt required for this application per manufacturer installation instructions.'
  },
  {
    code: 'RFGIWS',
    description: 'Ice & water barrier',
    unit: 'SF',
    avgPrice: 1.63,
    category: 'underlayment',
    ircCode: 'R905.2.7.1',
    defenseNote: 'Ice & water shield membrane required in valleys and at eaves per IRC R905.2.7.1 and manufacturer installation instructions. Required where there is a history of ice dams causing backup of water.'
  },
  {
    code: 'RFGRL',
    description: 'Roll roofing',
    unit: 'SQ',
    avgPrice: 164.78,
    category: 'underlayment'
  },
  {
    code: 'RFGRL+',
    description: 'Roll roofing - 50% overlap',
    unit: 'SQ',
    avgPrice: 270.39,
    category: 'underlayment'
  },

  // ==========================================
  // DRIP EDGE
  // ==========================================
  {
    code: 'RFGDRIP',
    description: 'Drip edge',
    unit: 'LF',
    avgPrice: 3.14,
    category: 'edges',
    ircCode: 'R905.2.8.5',
    defenseNote: 'Drip edge is REQUIRED per IRC R905.2.8.5 at eaves and rake edges of shingle roofs. Adjacent segments shall be overlapped a minimum of 2 inches. This is a code requirement, not optional.'
  },
  {
    code: 'RFGDRIP+',
    description: 'Drip edge - copper apron',
    unit: 'LF',
    avgPrice: 3.41,
    category: 'edges'
  },
  {
    code: 'RFGDRIPC',
    description: 'Drip edge - copper',
    unit: 'LF',
    avgPrice: 10.31,
    category: 'edges'
  },
  {
    code: 'RFGDRIPP',
    description: 'Drip edge - PVC/TPO clad metal',
    unit: 'LF',
    avgPrice: 7.62,
    category: 'edges'
  },

  // ==========================================
  // STARTER COURSE
  // ==========================================
  {
    code: 'RFGASTR',
    description: 'Asphalt starter - peel and stick',
    unit: 'LF',
    avgPrice: 1.86,
    category: 'starter',
    ircCode: 'R905.2.8.1',
    defenseNote: 'Starter strip shingles REQUIRED per IRC R905.2.8.1 at all roof eaves. EagleView confirms this is not included in waste calculation and must be added separately.'
  },
  {
    code: 'RFGASTR+',
    description: 'Asphalt starter - universal starter course',
    unit: 'LF',
    avgPrice: 1.78,
    category: 'starter',
    ircCode: 'R905.2.8.1',
    defenseNote: 'Universal starter course required per manufacturer installation instructions. Must use proper Xactimate line item (not waste).'
  },

  // ==========================================
  // HIP & RIDGE
  // ==========================================
  {
    code: 'RFGRIDGC',
    description: 'Hip / Ridge cap - cut from 3 tab - composition shingle',
    unit: 'LF',
    avgPrice: 7.26,
    category: 'ridge',
    defenseNote: 'Hip and ridge cap shingles required. EagleView/measurement report confirms this is NOT included in waste calculation and must be added as a separate line item.'
  },

  // ==========================================
  // FLASHING
  // ==========================================
  {
    code: 'RFGSTEP',
    description: 'Step flashing',
    unit: 'LF',
    avgPrice: 10.41,
    category: 'flashing',
    ircCode: 'R905.2.8.3',
    defenseNote: 'Step flashing REQUIRED per IRC R905.2.8.3 at all roof-to-wall intersections. Minimum 4" x 4" flashing pieces installed with each course of shingles.'
  },
  {
    code: 'RFGSTEPC',
    description: 'Step flashing - copper',
    unit: 'LF',
    avgPrice: 22.42,
    category: 'flashing'
  },
  {
    code: 'RFGFL14',
    description: 'Flashing - 14"',
    unit: 'LF',
    avgPrice: 5.44,
    category: 'flashing'
  },
  {
    code: 'RFGFL20',
    description: 'Flashing - 20"',
    unit: 'LF',
    avgPrice: 5.71,
    category: 'flashing',
    defenseNote: '20" wide flashing required for watertight shingle-to-flat transition.'
  },
  {
    code: 'RFGFL14C',
    description: 'Flashing 14" wide - copper',
    unit: 'LF',
    avgPrice: 23.94,
    category: 'flashing'
  },
  {
    code: 'RFGFLCAP',
    description: 'Cap flashing',
    unit: 'LF',
    avgPrice: 21.71,
    category: 'flashing'
  },
  {
    code: 'RFGFLJL',
    description: 'Flashing - J-L flashing - color finish',
    unit: 'LF',
    avgPrice: 5.80,
    category: 'flashing'
  },
  {
    code: 'RFGFLJL+',
    description: 'Flashing - L flashing - color finish',
    unit: 'LF',
    avgPrice: 6.31,
    category: 'flashing'
  },
  {
    code: 'RFGFLRIG',
    description: 'Hip / Ridge flashing',
    unit: 'LF',
    avgPrice: 8.87,
    category: 'flashing'
  },
  {
    code: 'RFGFLRD',
    description: 'Flashing - rain diverter',
    unit: 'EA',
    avgPrice: 54.72,
    category: 'flashing'
  },

  // ==========================================
  // CHIMNEY FLASHING
  // ==========================================
  {
    code: 'RFGFLCH',
    description: 'Chimney flashing - average (32" x 36")',
    unit: 'EA',
    avgPrice: 448.99,
    category: 'flashing',
    defenseNote: 'Complete chimney flashing set required per IRC R905.2.8.3. Includes base, step, and counter flashing. Photo substantiation included.'
  },
  {
    code: 'RFGFLCH+',
    description: 'Chimney flashing - small (24" x 24")',
    unit: 'EA',
    avgPrice: 345.07,
    category: 'flashing'
  },
  {
    code: 'RFGFLCH++',
    description: 'Chimney flashing - large (41" x 60")',
    unit: 'EA',
    avgPrice: 568.09,
    category: 'flashing'
  },
  {
    code: 'RFGFLPIPE',
    description: 'Flashing - pipe jack',
    unit: 'EA',
    avgPrice: 59.51,
    category: 'flashing'
  },
  {
    code: 'RFGFLPIPEL',
    description: 'Flashing - pipe jack - lead',
    unit: 'EA',
    avgPrice: 93.18,
    category: 'flashing'
  },
  {
    code: 'RFGFLPJSB',
    description: 'Flashing - pipe jack - split boot',
    unit: 'EA',
    avgPrice: 96.08,
    category: 'flashing',
    defenseNote: 'Split boot required for electrical mast penetration. Cannot remove/reset mast without split boot.'
  },

  // ==========================================
  // VALLEY METAL
  // ==========================================
  {
    code: 'RFGVMTL',
    description: 'Valley metal',
    unit: 'LF',
    avgPrice: 6.79,
    category: 'valley',
    ircCode: 'R905.2.8.2',
    defenseNote: 'Valley metal required per IRC R905.2.8.2. Valley linings shall be installed in accordance with manufacturer instructions. Photo shows open valley requiring metal lining.'
  },
  {
    code: 'RFGVMTLW',
    description: 'Valley metal - (W) profile',
    unit: 'LF',
    avgPrice: 7.58,
    category: 'valley',
    ircCode: 'R905.2.8.2',
    defenseNote: 'W-profile valley metal required to maintain Like, Kind, and Quality (LKQ). Substantiation photo included.'
  },
  {
    code: 'RFGVMTLP',
    description: 'Valley metal - painted',
    unit: 'LF',
    avgPrice: 7.21,
    category: 'valley'
  },

  // ==========================================
  // VENTILATION
  // ==========================================
  {
    code: 'RFGVENTA',
    description: 'Continuous ridge vent - aluminum',
    unit: 'LF',
    avgPrice: 10.30,
    category: 'ventilation',
    ircCode: 'R806.2',
    defenseNote: 'Ridge vent required to maintain proper attic ventilation per IRC R806.2. Ventilation area must be 1/150 of vented space.'
  },
  {
    code: 'RFGVENTR',
    description: 'Continuous ridge vent - shingle-over style',
    unit: 'LF',
    avgPrice: 11.00,
    category: 'ventilation',
    ircCode: 'R806.2'
  },
  {
    code: 'RFGVENTB',
    description: 'Roof vent - turbine type',
    unit: 'EA',
    avgPrice: 164.50,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTT',
    description: 'Roof vent - turtle type',
    unit: 'EA',
    avgPrice: 76.85,
    category: 'ventilation',
    ircCode: 'R806.2'
  },
  {
    code: 'RFGVENTT+',
    description: 'Roof vent - turtle type - Plastic',
    unit: 'EA',
    avgPrice: 66.97,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTE',
    description: 'Exhaust cap - through roof - 6" to 8"',
    unit: 'EA',
    avgPrice: 112.96,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTE+',
    description: 'Exhaust cap - through roof - up to 4"',
    unit: 'EA',
    avgPrice: 101.31,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTECS',
    description: 'Rain cap - 4 to 5"',
    unit: 'EA',
    avgPrice: 55.90,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTEC6',
    description: 'Rain cap - 6"',
    unit: 'EA',
    avgPrice: 62.92,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTEC8',
    description: 'Rain cap - 8"',
    unit: 'EA',
    avgPrice: 69.72,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTRAS',
    description: 'Roof vent - Detach & reset',
    unit: 'EA',
    avgPrice: 82.67,
    category: 'ventilation'
  },
  {
    code: 'RFGPAV',
    description: 'Roof mount power attic vent',
    unit: 'EA',
    avgPrice: 272.39,
    category: 'ventilation',
    defenseNote: 'Power vent flashing nails caulked; vent damaged during tear-off requires full replacement.'
  },
  {
    code: 'RFGPAVC',
    description: 'Power attic vent cover only - metal',
    unit: 'EA',
    avgPrice: 111.91,
    category: 'ventilation'
  },
  {
    code: 'RFGVENTG',
    description: 'Gravity roof vent/louver',
    unit: 'EA',
    avgPrice: 850.04,
    category: 'ventilation'
  },

  // ==========================================
  // DECKING / SHEATHING
  // ==========================================
  {
    code: 'RFGSH+',
    description: 'Sheathing - 1/2 - 12" O/C',
    unit: 'SF',
    avgPrice: 3.02,
    category: 'decking',
    ircCode: 'R905.2.1',
    defenseNote: 'Decking replacement required per IRC R905.2.1 - shingles must be attached to solid sheathing.'
  },
  {
    code: 'RFGSH3/8',
    description: 'Sheathing - plywood - 3/8" CDX',
    unit: 'SF',
    avgPrice: 2.94,
    category: 'decking'
  },
  {
    code: 'RFGSH5/8',
    description: 'Sheathing - plywood - 5/8" CDX',
    unit: 'SF',
    avgPrice: 3.10,
    category: 'decking',
    ircCode: 'R803.1',
    defenseNote: 'Decking must be ≥5/8" thick for 24" rafter spacing per IRC R803.1.'
  },
  {
    code: 'RFGSHW1/2',
    description: 'Sheathing - OSB - 1/2"',
    unit: 'SF',
    avgPrice: 2.61,
    category: 'decking'
  },
  {
    code: 'RFGSHW5/8',
    description: 'Sheathing - OSB - 5/8"',
    unit: 'SF',
    avgPrice: 3.05,
    category: 'decking'
  },
  {
    code: 'RFGFB1/2',
    description: 'Fiberboard - 1/2"',
    unit: 'SF',
    avgPrice: 1.79,
    category: 'decking'
  },
  {
    code: 'RFGFB1',
    description: 'Fiberboard - 1"',
    unit: 'SF',
    avgPrice: 1.97,
    category: 'decking'
  },
  {
    code: 'RFGFB2',
    description: 'Fiberboard - 2"',
    unit: 'SF',
    avgPrice: 2.44,
    category: 'decking'
  },
  {
    code: 'RFGFB3',
    description: 'Fiberboard - 3"',
    unit: 'SF',
    avgPrice: 3.27,
    category: 'decking'
  },

  // ==========================================
  // STEEP / HIGH CHARGES
  // ==========================================
  {
    code: 'RFGSTEEP',
    description: 'Additional charge for steep roof - 7/12 to 9/12 slope',
    unit: 'SQ',
    avgPrice: 56.27,
    category: 'steep',
    defenseNote: 'Roof slope at [X]/12 as documented in photos. Steep pitch charge required for slopes 7/12 to 9/12.'
  },
  {
    code: 'RFGSTEEP+',
    description: 'Additional charge for steep roof - 10/12 - 12/12 slope',
    unit: 'SQ',
    avgPrice: 88.44,
    category: 'steep',
    defenseNote: 'Very steep pitch (10/12-12/12) requires additional labor and safety equipment per OSHA requirements.'
  },
  {
    code: 'RFGSTEEP++',
    description: 'Additional charge for steep roof greater than 12/12 slope',
    unit: 'SQ',
    avgPrice: 114.88,
    category: 'steep'
  },
  {
    code: 'RFGHIGH+',
    description: 'Additional charge for high roof (2 stories or greater)',
    unit: 'SQ',
    avgPrice: 25.76,
    category: 'steep',
    defenseNote: 'Two-story or higher structure requires additional labor for material handling and safety per OSHA requirements.'
  },

  // ==========================================
  // DETACH & RESET
  // ==========================================
  {
    code: 'RFGDISHRS',
    description: 'Digital satellite system - Detach & reset',
    unit: 'EA',
    avgPrice: 53.42,
    category: 'detach-reset',
    defenseNote: 'Satellite dish must be detached and reset to complete roofing work. Cannot roof through or around existing installation.'
  },
  {
    code: 'RFGDISH',
    description: 'TV Dish set - metal collar',
    unit: 'LF',
    avgPrice: 9.67,
    category: 'detach-reset'
  },
  {
    code: 'RFGTILAR',
    description: 'Tile roofing - Detach & reset',
    unit: 'SQ',
    avgPrice: 901.96,
    category: 'detach-reset'
  },

  // ==========================================
  // MODIFIED BITUMEN / FLAT ROOF
  // ==========================================
  {
    code: 'RFGBI',
    description: 'Modified bitumen roof',
    unit: 'SQ',
    avgPrice: 501.57,
    category: 'flat-roof',
    ircCode: 'R905.2.2',
    defenseNote: 'Modified bitumen required on slopes less than 2/12 per IRC R905.2.2. Composition shingles are not approved for low-slope applications.'
  },
  {
    code: 'RFGBU3',
    description: 'Built-up 3 ply roofing - in place',
    unit: 'SQ',
    avgPrice: 418.99,
    category: 'flat-roof'
  },

  // ==========================================
  // INSULATION
  // ==========================================
  {
    code: 'RFGISO1+',
    description: 'Insulation - ISO board, 1"',
    unit: 'SQ',
    avgPrice: 270.40,
    category: 'insulation'
  },
  {
    code: 'RFGISO2',
    description: 'Insulation - ISO board, 2"',
    unit: 'SQ',
    avgPrice: 340.57,
    category: 'insulation'
  },

  // ==========================================
  // SPECIALTY ITEMS
  // ==========================================
  {
    code: 'RFGSNOW',
    description: 'Snow guard/stop',
    unit: 'EA',
    avgPrice: 29.20,
    category: 'specialty'
  },
  {
    code: 'RFGSNTAV',
    description: 'Snow guard - commercial riveted',
    unit: 'EA',
    avgPrice: 143.01,
    category: 'specialty'
  },
  {
    code: 'RFGGSTOP',
    description: 'Gravel stop',
    unit: 'LF',
    avgPrice: 2.94,
    category: 'specialty'
  },
  {
    code: 'RFGSCUP',
    description: 'Roof scupper - aluminum',
    unit: 'EA',
    avgPrice: 291.63,
    category: 'specialty'
  },
  {
    code: 'RFGCUP',
    description: 'Cupola - Wood',
    unit: 'EA',
    avgPrice: 1285.11,
    category: 'specialty'
  },
  {
    code: 'RFGCUP+',
    description: 'Cupola - Vinyl',
    unit: 'EA',
    avgPrice: 1513.22,
    category: 'specialty'
  },
  {
    code: 'RFGCUP++',
    description: 'Cupola - Copper',
    unit: 'EA',
    avgPrice: 4315.60,
    category: 'specialty'
  },
  {
    code: 'RFGFIN',
    description: 'Roof finial',
    unit: 'EA',
    avgPrice: 465.64,
    category: 'specialty'
  },
  {
    code: 'RFGGCR300',
    description: 'Gable cornice return - laminated',
    unit: 'EA',
    avgPrice: 94.23,
    category: 'specialty'
  },
  {
    code: 'RFGGCS300',
    description: 'Gable cornice return - 3 tab',
    unit: 'LF',
    avgPrice: 16.04,
    category: 'specialty'
  },

  // ==========================================
  // METAL ROOFING
  // ==========================================
  {
    code: 'RFGMTL',
    description: 'Metal roofing',
    unit: 'SF',
    avgPrice: 7.50,
    category: 'metal',
    ircCode: 'R905.4.1',
    defenseNote: 'Metal roofing requires solid/closely fitted decking per IRC R905.4.1.'
  },
  {
    code: 'RFGCOPF',
    description: 'Copper panel - flat seam - 16 oz',
    unit: 'SF',
    avgPrice: 35.99,
    category: 'metal'
  },

  // ==========================================
  // TILE ROOFING
  // ==========================================
  {
    code: 'RFGTIL',
    description: 'Tile roofing - Clay - "S" or flat tile',
    unit: 'SQ',
    avgPrice: 1135.35,
    category: 'tile'
  },
  {
    code: 'RFGTILE',
    description: 'Tile roofing - Clay - "S" or flat (per TILE)',
    unit: 'EA',
    avgPrice: 42.11,
    category: 'tile'
  },

  // ==========================================
  // COATINGS
  // ==========================================
  {
    code: 'RFGALPNT',
    description: 'Aluminum coating - without fiber',
    unit: 'SF',
    avgPrice: 0.95,
    category: 'coating'
  },
  {
    code: 'RFGALPNT+',
    description: 'Aluminum coating - with fiber',
    unit: 'SF',
    avgPrice: 1.00,
    category: 'coating'
  }
]

/**
 * Get Xactimate code info by code string
 */
export function getXactimateInfo(code: string): XactimateLineItem | undefined {
  return XACTIMATE_CODES.find(c => c.code.toUpperCase() === code.toUpperCase())
}

/**
 * Search Xactimate codes by description or code
 */
export function searchXactimateCodes(query: string): XactimateLineItem[] {
  const q = query.toLowerCase()
  return XACTIMATE_CODES.filter(c => 
    c.code.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  )
}

/**
 * Get all codes by category
 */
export function getCodesByCategory(category: string): XactimateLineItem[] {
  return XACTIMATE_CODES.filter(c => c.category === category)
}

/**
 * Format price with unit for display
 */
export function formatXactimatePrice(code: XactimateLineItem): string {
  return `$${code.avgPrice.toFixed(2)} ${code.unit}`
}
