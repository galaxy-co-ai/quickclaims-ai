/**
 * Commonly Missed Items Reference
 * 
 * These are items that insurance carriers frequently omit from their scopes.
 * The AI uses this to proactively identify missing items during delta analysis.
 */

export interface MissedItemTemplate {
  code: string
  name: string
  category: string
  ircCode: string | null
  reason: string
  defenseNote: string
  photoEvidence: string[]
  typicalQuantitySource: string
  priority: 'critical' | 'high' | 'medium'
}

export const COMMONLY_MISSED_ITEMS: MissedItemTemplate[] = [
  // ==========================================
  // CRITICAL - Code Required
  // ==========================================
  {
    code: 'RFGDRIP',
    name: 'Drip Edge',
    category: 'edges',
    ircCode: 'R905.2.8.5',
    reason: 'REQUIRED by code at eaves and rake edges - carriers often omit entirely',
    defenseNote: 'Drip edge is REQUIRED per IRC R905.2.8.5 at ALL eaves and rake edges of shingle roofs. This is a CODE REQUIREMENT, not optional. The code states: "A drip edge shall be provided at eaves and rake edges of shingle roofs. Adjacent segments of drip edge shall be overlapped a minimum of 2 inches." Measurement report confirms total eave + rake linear footage.',
    photoEvidence: ['Edge of roof photo showing existing/missing drip edge', 'Eave close-up', 'Rake close-up'],
    typicalQuantitySource: 'Eaves LF + Rakes LF from EagleView/Hover report',
    priority: 'critical'
  },
  {
    code: 'RFGASTR',
    name: 'Starter Course',
    category: 'starter',
    ircCode: 'R905.2.8.1',
    reason: 'Required per code - NOT included in waste calculations',
    defenseNote: 'Starter strip shingles REQUIRED per IRC R905.2.8.1 at ALL roof eaves: "Starter strip shingles, or the equivalent, shall be applied at all roof eaves." EagleView measurement report confirms this is NOT included in shingle waste calculation and must be added as a separate line item. Must use proper Xactimate line item (not waste).',
    photoEvidence: ['Edge of roof showing starter course installation point'],
    typicalQuantitySource: 'Total eaves LF + rakes LF from measurement report',
    priority: 'critical'
  },
  {
    code: 'RFGIWS',
    name: 'Ice & Water Shield',
    category: 'underlayment',
    ircCode: 'R905.2.7.1',
    reason: 'Required in valleys and at eaves per code and manufacturer instructions',
    defenseNote: 'Ice & water shield membrane required per IRC R905.2.7.1 which states ice barrier is required "in areas where there has been a history of ice forming along the eaves causing a backup of water." Additionally, manufacturer installation instructions require IWS in all valleys. Valley application requires minimum 36" wide IWS per IRC R905.2.8.2. Must extend from eaves to point at least 24" inside exterior wall line.',
    photoEvidence: ['Valley photos', 'Eave photos showing IWS installation area'],
    typicalQuantitySource: 'Valley LF × 3 ft width + Eaves LF × 2 ft width',
    priority: 'critical'
  },
  {
    code: 'RFGSTEP',
    name: 'Step Flashing',
    category: 'flashing',
    ircCode: 'R905.2.8.3',
    reason: 'Required at all roof-to-wall intersections',
    defenseNote: 'Step flashing REQUIRED per IRC R905.2.8.3 at all roof-to-wall intersections: "Where vertical surfaces intersect a sloping roof plane, step flashing shall be used. Each step flashing shall be a minimum of 4 inches by 4 inches." Existing flashing that is pried, bent, or damaged during tear-off must be replaced per IRC R908.5.',
    photoEvidence: ['Wall-to-roof intersection photos', 'Chimney step flashing', 'Dormer sidewall flashing'],
    typicalQuantitySource: 'Measure all wall intersections from photos/measurements',
    priority: 'critical'
  },
  {
    code: 'RFGRIDGC',
    name: 'Hip/Ridge Cap',
    category: 'ridge',
    ircCode: null,
    reason: 'NOT included in EagleView waste calculation - must be separate line item',
    defenseNote: 'Hip and ridge cap shingles are NOT included in the EagleView/measurement waste calculation and must be added as a separate line item. This is confirmed in EagleView reports which state waste does not include hip/ridge cap material. Total hip + ridge linear footage from measurement report must be added.',
    photoEvidence: ['Ridge line photos', 'Hip line photos'],
    typicalQuantitySource: 'Ridge LF + Hips LF from measurement report',
    priority: 'critical'
  },

  // ==========================================
  // HIGH PRIORITY - Safety & Labor
  // ==========================================
  {
    code: 'RFGSTEEP',
    name: 'Steep Pitch Charges',
    category: 'steep',
    ircCode: null,
    reason: 'Additional labor required for pitches 7/12 and above',
    defenseNote: 'Roof slope documented at [X]/12 as shown in photos and measurement report. Steep pitch charge required for slopes 7/12 to 9/12 per industry standards due to additional labor, safety equipment, and reduced productivity. Workers cannot safely walk on slopes above 7/12 without additional safety measures.',
    photoEvidence: ['Pitch gauge photo', 'Overview showing roof steepness', 'Measurement report pitch data'],
    typicalQuantitySource: 'Total roof squares from measurement report',
    priority: 'high'
  },
  {
    code: 'RFGHIGH+',
    name: 'Two-Story/High Charges',
    category: 'steep',
    ircCode: 'OSHA',
    reason: 'OSHA requires additional safety measures for heights; carriers often omit',
    defenseNote: 'Two-story or higher structure requires additional labor for material handling and safety per OSHA requirements. Workers must use fall protection and specialized equipment for heights over one story. Photos document [2/3]-story structure requiring high roof charge.',
    photoEvidence: ['Ground-level elevation photos showing building height', 'All four elevations'],
    typicalQuantitySource: 'Total roof squares from measurement report',
    priority: 'high'
  },
  {
    code: 'RFGSUPR',
    name: 'Supervisor Hours',
    category: 'labor',
    ircCode: 'OSHA',
    reason: 'OSHA requires supervision for steep or 2+ story work',
    defenseNote: 'OSHA requires supervision for roofing work on 2+ story structures or steep pitches exceeding 5/12. Project supervision/project management hours required for safety compliance and crew coordination. Cannot have multiple crew members working at heights without designated supervisor.',
    photoEvidence: ['Photos showing height/steepness requiring supervision'],
    typicalQuantitySource: 'Estimate 8-16 hours based on job size',
    priority: 'high'
  },

  // ==========================================
  // HIGH PRIORITY - Structural
  // ==========================================
  {
    code: 'RFGCRKT',
    name: 'Cricket/Saddle',
    category: 'flashing',
    ircCode: 'R903.2.2',
    reason: 'Required for chimneys/penetrations over 30" wide - frequently omitted',
    defenseNote: 'Cricket/saddle REQUIRED per IRC R903.2.2 which states: "A cricket or saddle shall be installed on the ridge side of any chimney or penetration more than 30 inches wide as measured perpendicular to the slope." Photos and measurements confirm chimney width exceeds 30". Existing metal cricket shows storm damage and will be further damaged during tear-off; replacement necessary.',
    photoEvidence: ['Chimney with measurement showing width', 'Cricket current condition'],
    typicalQuantitySource: '1 EA per qualifying chimney/penetration',
    priority: 'high'
  },
  {
    code: 'RFGDECK',
    name: 'Decking Replacement',
    category: 'decking',
    ircCode: 'R905.2.1',
    reason: 'Often needed but carriers resist - requires attic inspection proof',
    defenseNote: 'Decking replacement required per IRC R905.2.1 which mandates shingles be fastened to solidly sheathed decks. Photos from attic inspection document [damaged/water-soaked/spaced/deteriorated] decking that does not meet code requirements. Per IRC R908.3.1.1, roof recover not permitted over water-soaked or deteriorated decking.',
    photoEvidence: ['Attic photos showing decking condition', 'Water stains', 'Rot', 'Spacing issues'],
    typicalQuantitySource: 'Estimate SF from attic inspection - typically 10-20% of total',
    priority: 'high'
  },
  {
    code: 'RFGVMTLW',
    name: 'Valley Metal (W-Profile)',
    category: 'valley',
    ircCode: 'R905.2.8.2',
    reason: 'Required for open valleys; LKQ replacement needed',
    defenseNote: 'W-profile valley metal required per IRC R905.2.8.2 to maintain Like, Kind, and Quality (LKQ). Valley linings shall be installed per manufacturer instructions. Open valleys require minimum 24" wide valley lining. Existing W-valley metal must be replaced to maintain LKQ construction and watertight assembly.',
    photoEvidence: ['Valley photos showing W-profile metal', 'Valley intersection photos'],
    typicalQuantitySource: 'Valley LF from measurement report',
    priority: 'high'
  },

  // ==========================================
  // MEDIUM PRIORITY - Site & Protection
  // ==========================================
  {
    code: 'RFGDUMP',
    name: 'Debris Removal/Dumpster',
    category: 'site',
    ircCode: null,
    reason: 'Cannot do partial haul-off - full unit required',
    defenseNote: 'Updated to 1.0 units; haul-off cannot be partial. Debris removal and disposal is required for tear-off operations. Dumpster/haul-off cannot be prorated - must include full removal and disposal costs.',
    photoEvidence: ['Overview photos showing tear-off scope'],
    typicalQuantitySource: '1-2 EA based on squares (typically 1 per 20 squares)',
    priority: 'medium'
  },
  {
    code: 'RFGTARP',
    name: 'Ground Tarping/Protection',
    category: 'site',
    ircCode: null,
    reason: 'Required for property protection during tear-off',
    defenseNote: 'Perimeter ground tarping required for property protection during tear-off. Landscaping, driveway, and property at risk from debris. Request up front when steepness/complexity and landscaping are documented. This protects property during construction and prevents homeowner damage claims.',
    photoEvidence: ['Ground-level photos showing landscaping', 'Manicured lawn', 'Gardens', 'Driveway'],
    typicalQuantitySource: 'Perimeter LF of work area',
    priority: 'medium'
  },
  {
    code: 'RFGSAT',
    name: 'Satellite Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Cannot roof through - must detach and reset',
    defenseNote: 'Satellite dish must be detached and reset to complete roofing work. Cannot roof through or around existing installation without detachment. Photos document satellite dish requiring D&R.',
    photoEvidence: ['Roof photos showing satellite dish location'],
    typicalQuantitySource: '1 EA per dish',
    priority: 'medium'
  },
  {
    code: 'GTRDR',
    name: 'Gutter Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Required for proper drip edge installation',
    defenseNote: 'Gutters must be detached and reset for proper drip edge installation per IRC R905.2.8.5. Drip edge must extend 1/4" below sheathing and install behind gutter. Cannot install code-compliant drip edge without gutter D&R.',
    photoEvidence: ['Eave photos showing gutter installation'],
    typicalQuantitySource: 'Gutter LF from photos/measurements',
    priority: 'medium'
  },

  // ==========================================
  // MEDIUM PRIORITY - Ventilation
  // ==========================================
  {
    code: 'RFGVENTA',
    name: 'Ridge Vent',
    category: 'ventilation',
    ircCode: 'R806.2',
    reason: 'Often omitted or under-scoped; requires NFA calculation',
    defenseNote: 'Ridge vent required to maintain proper attic ventilation per IRC R806.2. Ventilation area must be 1/150 of vented attic space (1/300 with vapor retarder). NFA calculation: Attic SF ÷ 150 = minimum ventilation sq in required. Current scope provides insufficient ventilation.',
    photoEvidence: ['Ridge line photos', 'Attic photos showing ventilation'],
    typicalQuantitySource: 'Ridge LF from measurement report',
    priority: 'medium'
  },
  {
    code: 'RFGFLPJSB',
    name: 'Split Boot (Pipe Jack)',
    category: 'flashing',
    ircCode: null,
    reason: 'Required for electrical mast - cannot remove/reset without split boot',
    defenseNote: 'Split boot required for electrical mast penetration. Cannot remove and reset electrical mast without split boot. Standard pipe jack will not work for electrical mast installations. Photo documents electrical mast requiring split boot flashing.',
    photoEvidence: ['Electrical mast penetration photos'],
    typicalQuantitySource: '1 EA per electrical mast',
    priority: 'medium'
  }
]

/**
 * Get all commonly missed items
 */
export function getAllMissedItems(): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS
}

/**
 * Get missed items by priority
 */
export function getMissedItemsByPriority(priority: 'critical' | 'high' | 'medium'): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.priority === priority)
}

/**
 * Get missed items by category
 */
export function getMissedItemsByCategory(category: string): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.category === category)
}

/**
 * Get the defense note for a specific item
 */
export function getDefenseNote(code: string): string | null {
  const item = COMMONLY_MISSED_ITEMS.find(i => i.code.toUpperCase() === code.toUpperCase())
  return item?.defenseNote || null
}

/**
 * Get all items that have specific IRC code requirements
 */
export function getCodeRequiredItems(): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.ircCode !== null)
}
