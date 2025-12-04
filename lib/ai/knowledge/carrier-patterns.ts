/**
 * Carrier Objection Patterns and Rebuttal Templates
 * 
 * Database of common carrier objections and proven rebuttal strategies.
 * These patterns are based on real-world supplement experience.
 * 
 * IMPORTANT: Stay construction-focused. Never argue policy interpretation.
 * Focus on codes, manufacturer specs, and site conditions only.
 */

export interface CarrierObjection {
  objection: string
  category: 'code' | 'quantity' | 'pricing' | 'coverage' | 'documentation'
  commonCarriers: string[]
  frequency: 'very_common' | 'common' | 'occasional'
  rebuttalStrategy: string
  rebuttalTemplate: string
  evidenceNeeded: string[]
  relatedCodes: string[]
}

export interface CarrierProfile {
  carrier: string
  commonObjectionPatterns: string[]
  negotiationTips: string[]
  escalationPath: string[]
  typicalTimeline: string
  knownTendencies: string[]
}

// ============================================
// COMMON OBJECTION PATTERNS
// ============================================

export const CARRIER_OBJECTIONS: CarrierObjection[] = [
  // DRIP EDGE OBJECTIONS
  {
    objection: 'Drip edge is not required in this area / market',
    category: 'code',
    commonCarriers: ['State Farm', 'Allstate', 'Farmers'],
    frequency: 'very_common',
    rebuttalStrategy: 'IRC R905.2.8.5 is a national code requirement. Local markets do not override building codes. The code states "shall" which is mandatory, not optional.',
    rebuttalTemplate: 'Our submission follows IRC R905.2.8.5 which states: "A drip edge SHALL be provided at eaves and rake edges of shingle roofs." This is a mandatory CODE REQUIREMENT regardless of market or region. The term "shall" in building codes indicates mandatory compliance, not optional. Additionally, [Manufacturer] installation instructions require drip edge for warranty compliance per IRC R904.1. Photos on page [X] show [existing/missing] drip edge at [X] LF of eave and [X] LF of rake edges.',
    evidenceNeeded: ['Edge of roof photos showing current drip edge condition', 'Measurement report showing eave/rake LF', 'IRC R905.2.8.5 excerpt'],
    relatedCodes: ['R905.2.8.5', 'R904.1']
  },
  {
    objection: 'Drip edge can be reused / does not need replacement',
    category: 'code',
    commonCarriers: ['USAA', 'Liberty Mutual', 'Nationwide'],
    frequency: 'common',
    rebuttalStrategy: 'IRC R908.5 requires replacement of flashing that is bent, pried, or damaged during removal. Drip edge cannot be removed without damage.',
    rebuttalTemplate: 'Per IRC R908.5, existing flashing that is pried, bent, or damaged during tear-off must be replaced. Drip edge is secured with roofing nails and cannot be removed during shingle tear-off without bending, prying, or otherwise damaging the metal. This is physically impossible to avoid during proper tear-off procedures. Replacement is required to maintain weathertight assembly.',
    evidenceNeeded: ['Photos of drip edge showing nail holes and condition', 'IRC R908.5 reference'],
    relatedCodes: ['R908.5']
  },

  // STARTER COURSE OBJECTIONS
  {
    objection: 'Starter is included in waste / already accounted for',
    category: 'quantity',
    commonCarriers: ['State Farm', 'Allstate', 'Farmers', 'Liberty Mutual'],
    frequency: 'very_common',
    rebuttalStrategy: 'EagleView and HOVER reports explicitly state that waste does NOT include starter, hip/ridge, or other accessories. This is documented on the measurement report.',
    rebuttalTemplate: 'EagleView/HOVER measurement report page [X] explicitly states: "Suggested waste percentages do NOT include hip and ridge cap or starter strip material." This is confirmed in the waste calculation methodology. Starter course must be added as a SEPARATE line item per IRC R905.2.8.1 which requires starter strip shingles at ALL roof eaves. Quantity: [X] LF eaves + [X] LF rakes = [X] total LF.',
    evidenceNeeded: ['EagleView/HOVER report showing waste disclaimer', 'Total eave and rake measurements', 'IRC R905.2.8.1 reference'],
    relatedCodes: ['R905.2.8.1', 'R904.1']
  },

  // ICE & WATER SHIELD OBJECTIONS
  {
    objection: 'Ice and water shield is not required in this climate/region',
    category: 'code',
    commonCarriers: ['Allstate', 'Farmers', 'Nationwide'],
    frequency: 'common',
    rebuttalStrategy: 'Even in mild climates, manufacturer installation instructions require IWS in valleys. IRC R904.1 mandates following manufacturer specs.',
    rebuttalTemplate: 'While IRC R905.2.7.1 addresses ice dams specifically, [Manufacturer] installation instructions REQUIRE ice and water shield in ALL valleys regardless of climate. Per IRC R904.1, roof assemblies must be installed per manufacturer instructions. Valley application per manufacturer specs requires minimum 36" wide ice barrier. Additionally, this requirement ensures Like Kind and Quality (LKQ) restoration to pre-loss condition. See photos page [X] showing valley configuration.',
    evidenceNeeded: ['Valley photos', 'Manufacturer installation manual excerpt', 'IRC R904.1 and R905.2.7.1 references'],
    relatedCodes: ['R905.2.7.1', 'R904.1', 'R905.2.8.2']
  },
  {
    objection: 'Ice and water shield was not present before loss',
    category: 'coverage',
    commonCarriers: ['State Farm', 'USAA'],
    frequency: 'common',
    rebuttalStrategy: 'LKQ (Like Kind and Quality) requires restoration to CODE-COMPLIANT condition, not replication of pre-existing code violations.',
    rebuttalTemplate: 'The principle of Like Kind and Quality (LKQ) requires restoration to CURRENT CODE-COMPLIANT condition, not replication of code violations. IRC R905.2.7.1 and manufacturer installation instructions now require ice barrier in valleys and at eaves. A code-compliant roof today must include these components. The insurance obligation is to restore the property to pre-loss VALUE with code-compliant construction, not to replicate outdated or non-compliant construction methods.',
    evidenceNeeded: ['Current code requirements', 'Manufacturer installation instructions', 'Valley and eave photos'],
    relatedCodes: ['R905.2.7.1', 'R904.1']
  },

  // STEP FLASHING OBJECTIONS
  {
    objection: 'Step flashing can be reused / only replace damaged pieces',
    category: 'code',
    commonCarriers: ['State Farm', 'Allstate', 'Farmers', 'Liberty Mutual'],
    frequency: 'very_common',
    rebuttalStrategy: 'IRC R908.5 requires replacement of flashing damaged during removal. Step flashing is integrated with shingle courses and cannot be separated without damage.',
    rebuttalTemplate: 'Per IRC R908.5, flashing that is bent, pried, or damaged must be replaced. Step flashing pieces are woven into shingle courses with overlapping layers. During tear-off, step flashing is inevitably bent, pried, and damaged as each shingle course is removed. Individual pieces cannot be selectively "saved" while removing integrated shingle courses. Complete replacement of step flashing at [X] LF of wall intersection is required for proper weathertight installation per IRC R905.2.8.3.',
    evidenceNeeded: ['Photos of wall-to-roof intersections', 'Close-up of step flashing condition', 'Measurement of wall intersection length'],
    relatedCodes: ['R905.2.8.3', 'R908.5']
  },

  // HIP/RIDGE OBJECTIONS
  {
    objection: 'Hip and ridge included in waste calculation',
    category: 'quantity',
    commonCarriers: ['State Farm', 'Allstate', 'Farmers', 'USAA'],
    frequency: 'very_common',
    rebuttalStrategy: 'Measurement reports explicitly exclude hip/ridge from waste. This is documented clearly on EagleView/HOVER reports.',
    rebuttalTemplate: 'EagleView/HOVER measurement report explicitly states waste calculation does NOT include hip and ridge cap material. Report page [X] shows waste disclaimer: "Suggested waste percentages do NOT include hip and ridge cap." Total hip length [X] LF + ridge length [X] LF = [X] LF requiring ridge cap shingles. This must be added as separate line item.',
    evidenceNeeded: ['EagleView/HOVER report with waste disclaimer', 'Hip and ridge measurements'],
    relatedCodes: []
  },

  // STEEP CHARGE OBJECTIONS
  {
    objection: 'Steep charge not warranted for this pitch',
    category: 'pricing',
    commonCarriers: ['Liberty Mutual', 'Nationwide', 'Progressive'],
    frequency: 'common',
    rebuttalStrategy: 'Xactimate pricing and industry standards define steep as 7/12 and above. Provide pitch measurement proof.',
    rebuttalTemplate: 'Roof pitch documented at [X]/12 as shown in measurement report and photos page [X]. Per Xactimate pricing standards, steep roof charge applies to pitches 7/12 to 9/12 (RFGSTEEP), 10/12-12/12 (RFGSTEEP+), and >12/12 (RFGSTEEP++). This pitch requires additional labor time, safety equipment, and reduced productivity. OSHA regulations require additional fall protection measures for pitches above 4/12, with significantly increased requirements above 7/12.',
    evidenceNeeded: ['Pitch gauge photo', 'Measurement report showing pitch', 'Four elevation photos showing roof steepness'],
    relatedCodes: []
  },

  // HIGH/TWO-STORY OBJECTIONS
  {
    objection: 'Two-story charge is not justified',
    category: 'pricing',
    commonCarriers: ['Farmers', 'Nationwide'],
    frequency: 'occasional',
    rebuttalStrategy: 'Height increases material handling, staging requirements, and OSHA safety protocols. Ground-level photos document building height.',
    rebuttalTemplate: 'Ground-level elevation photos on page [X] clearly document a [2/3]-story structure. High roof charge is required for additional labor in material handling (carrying materials up additional stories), staging requirements, and OSHA fall protection compliance. Workers cannot carry bundles of shingles up ladders safely to higher elevations without additional time and safety measures. This is industry standard pricing reflected in Xactimate.',
    evidenceNeeded: ['Four ground-level elevation photos', 'Photos showing roofline height relative to ground'],
    relatedCodes: []
  },

  // VENTILATION OBJECTIONS
  {
    objection: 'Ventilation was not present / not matching',
    category: 'coverage',
    commonCarriers: ['State Farm', 'USAA', 'Allstate'],
    frequency: 'common',
    rebuttalStrategy: 'IRC R806.2 requires proper ventilation. Manufacturer warranties require adequate ventilation. LKQ requires code compliance.',
    rebuttalTemplate: 'IRC R806.2 requires minimum ventilation of 1 sq ft NFA per 150 sq ft of attic space (1:300 with vapor barrier). Additionally, [Manufacturer] warranty requirements mandate proper attic ventilation - inadequate ventilation VOIDS shingle warranty. The property must be restored to code-compliant, warranty-eligible condition. Current ventilation calculation: Attic area [X] SF ÷ 150 = [X] sq in NFA required. Ridge vent at [X] LF provides [X] sq in NFA.',
    evidenceNeeded: ['Attic photos', 'Ventilation calculation worksheet', 'Manufacturer warranty requirements', 'IRC R806.2 reference'],
    relatedCodes: ['R806.2', 'R904.1']
  },

  // DECKING OBJECTIONS
  {
    objection: 'Decking replacement not covered / cannot verify damage',
    category: 'documentation',
    commonCarriers: ['State Farm', 'Allstate', 'Liberty Mutual', 'Farmers'],
    frequency: 'common',
    rebuttalStrategy: 'Attic photos document decking condition. IRC R905.2.1 requires solid sheathing. IRC R908.3.1.1 prohibits recover over damaged decking.',
    rebuttalTemplate: 'Attic inspection photos on page [X] document [water damage/rot/deterioration/spaced boards] in decking. Per IRC R905.2.1, shingles must be fastened to solidly sheathed decks. Per IRC R908.3.1.1, roof recover is NOT permitted over water-soaked or deteriorated decking. Photos clearly show [specific damage description]. Estimated [X] SF decking requires replacement based on documented damage areas.',
    evidenceNeeded: ['Attic photos showing decking condition', 'Close-ups of damage areas', 'Measurements of affected areas'],
    relatedCodes: ['R905.2.1', 'R908.3.1.1', 'R803.1']
  },

  // O&P OBJECTIONS
  {
    objection: 'Overhead and Profit not warranted / only one trade involved',
    category: 'pricing',
    commonCarriers: ['State Farm', 'Allstate', 'USAA', 'Farmers', 'Liberty Mutual'],
    frequency: 'very_common',
    rebuttalStrategy: 'O&P is warranted when a general contractor coordinates multiple trades or complex work. Document complexity and coordination required.',
    rebuttalTemplate: 'Overhead and Profit is warranted per industry standards when: (1) multiple trades are involved requiring coordination, or (2) complexity of work requires general contractor supervision. This project involves [roofing, gutters, siding, interior repairs, etc.] requiring coordination between [trades]. Additionally, [steep pitch/two-story/complex roof design] requires project management, safety planning, and crew coordination. O&P is standard for projects of this scope and complexity.',
    evidenceNeeded: ['Scope showing multiple trades', 'Photos showing complexity', 'Documentation of coordination required'],
    relatedCodes: []
  },

  // VALLEY METAL OBJECTIONS
  {
    objection: 'Valley metal not present / IWS sufficient',
    category: 'code',
    commonCarriers: ['Farmers', 'Nationwide'],
    frequency: 'occasional',
    rebuttalStrategy: 'IRC R905.2.8.2 and manufacturer specs define valley requirements. Open valleys require metal lining. LKQ matching required.',
    rebuttalTemplate: 'Photos on page [X] document [open/W-profile] valley construction. Per IRC R905.2.8.2, open valleys require minimum 24" wide valley lining. Valley metal must be replaced to maintain Like Kind and Quality (LKQ). Even if IWS is installed beneath, the visible valley metal must be replaced to restore pre-loss appearance and function. [Manufacturer] instructions require both IWS and valley metal for proper valley construction.',
    evidenceNeeded: ['Valley photos showing current construction', 'Close-up of valley metal condition', 'Manufacturer valley installation requirements'],
    relatedCodes: ['R905.2.8.2', 'R904.1']
  },

  // CHIMNEY FLASHING OBJECTIONS
  {
    objection: 'Chimney flashing can be reused',
    category: 'code',
    commonCarriers: ['State Farm', 'USAA', 'Allstate'],
    frequency: 'common',
    rebuttalStrategy: 'Base flashing is integrated with shingle courses. Step flashing cannot be removed without damage. Counter flashing must be reset.',
    rebuttalTemplate: 'Chimney flashing consists of multiple components: base flashing, step flashing, and counter flashing. During tear-off, base and step flashing are integrated with shingle courses and cannot be removed without damage per IRC R908.5. Even if counter flashing is reusable, the base and step flashing surrounding the chimney at [X]" x [X]" dimension require replacement. Photos page [X] show chimney flashing condition. Complete chimney flashing package required per IRC R905.2.8.',
    evidenceNeeded: ['Chimney photos with measurements', 'Close-up of current flashing condition', 'Photos showing integration with shingles'],
    relatedCodes: ['R905.2.8', 'R908.5']
  },

  // DEBRIS/HAUL-OFF OBJECTIONS
  {
    objection: 'Reduce debris removal / haul-off quantity',
    category: 'quantity',
    commonCarriers: ['State Farm', 'Allstate', 'Liberty Mutual'],
    frequency: 'common',
    rebuttalStrategy: 'Haul-off cannot be fractional. Full dumpster loads required. Weight and volume cannot be partially disposed.',
    rebuttalTemplate: 'Debris removal and disposal cannot be fractional - full unit(s) required. A dumpster cannot be partially filled and returned for partial credit. Based on [X] squares of [laminated/3-tab] shingles plus underlayment, flashing, and debris, minimum [X] dumpster load(s) required. Industry standard is approximately 1 dumpster per 20-25 squares of laminated shingles due to weight restrictions.',
    evidenceNeeded: ['Square footage/squares calculation', 'Photos of existing roof showing layers'],
    relatedCodes: []
  },

  // PERMIT/INSPECTION OBJECTIONS
  {
    objection: 'Permit not required in this jurisdiction',
    category: 'coverage',
    commonCarriers: ['Farmers', 'Nationwide', 'Progressive'],
    frequency: 'occasional',
    rebuttalStrategy: 'Most jurisdictions require permits for roofing work. Contact local building department for verification.',
    rebuttalTemplate: 'Per [City/County] Building Department, roofing permits are required for roof replacement projects. Permit fee of approximately $[X] is standard. Additionally, some jurisdictions require wind mitigation inspections or energy code compliance verification. Permit costs are a legitimate expense of proper, code-compliant roof replacement.',
    evidenceNeeded: ['Local building department permit requirements', 'Permit fee schedule'],
    relatedCodes: []
  },

  // LABOR HOUR OBJECTIONS
  {
    objection: 'Labor hours excessive / reduce roofer hours',
    category: 'quantity',
    commonCarriers: ['All carriers'],
    frequency: 'common',
    rebuttalStrategy: 'Document specific tasks requiring additional labor. OSHA safety requirements. Complexity factors.',
    rebuttalTemplate: 'Additional labor hours are required for: [specific tasks - e.g., working safely around electrical mast, steep pitch requiring harness setup/removal, two-story requiring additional staging, complex roof geometry, limited access areas, etc.]. OSHA requires additional time for safety setup on [steep/high] roofs. These tasks are not included in base shingle installation pricing and require separate labor line items.',
    evidenceNeeded: ['Photos documenting complexity', 'Safety requirements documentation', 'Specific task list'],
    relatedCodes: []
  },

  // CRICKET/SADDLE OBJECTIONS
  {
    objection: 'Cricket not required / was not present',
    category: 'code',
    commonCarriers: ['State Farm', 'Allstate', 'Farmers'],
    frequency: 'occasional',
    rebuttalStrategy: 'IRC R903.2.2 requires cricket for chimneys >30" wide. Measurement proves requirement.',
    rebuttalTemplate: 'IRC R903.2.2 requires: "A cricket or saddle shall be installed on the ridge side of any chimney or penetration more than 30 inches wide as measured perpendicular to the slope." Photos page [X] and measurement confirm chimney width of [X] inches, exceeding 30" threshold. Cricket is a CODE REQUIREMENT regardless of whether one was previously installed. Metal cricket shows storm damage and will be further damaged during tear-off - replacement required.',
    evidenceNeeded: ['Chimney photo with measuring tape showing width', 'Cricket condition photos', 'IRC R903.2.2 reference'],
    relatedCodes: ['R903.2.2']
  }
]

// ============================================
// CARRIER PROFILES
// ============================================

export const CARRIER_PROFILES: CarrierProfile[] = [
  {
    carrier: 'State Farm',
    commonObjectionPatterns: [
      'Drip edge not required in market',
      'Starter included in waste',
      'Step flashing can be reused',
      'O&P not warranted',
      'Hip/ridge in waste'
    ],
    negotiationTips: [
      'Code citations carry significant weight - always cite IRC',
      'Measurement report waste disclaimers are powerful evidence',
      'Request manager review if adjuster denies code-required items',
      'State Farm uses Select Service contractors - know their pricing'
    ],
    escalationPath: [
      'Initial adjuster review',
      'Team manager escalation',
      'Claims manager',
      'State insurance commissioner complaint (if bad faith)'
    ],
    typicalTimeline: '2-4 weeks for initial response, 1-2 weeks per rebuttal cycle',
    knownTendencies: [
      'Generally responsive to code citations',
      'May initially deny LKQ items',
      'Tends to approve when documentation is strong',
      'Uses Xactimate pricing database'
    ]
  },
  {
    carrier: 'Allstate',
    commonObjectionPatterns: [
      'Drip edge not standard',
      'Ice & water shield not required',
      'O&P rarely approved',
      'Steep/high charges questioned',
      'Decking replacement resisted'
    ],
    negotiationTips: [
      'Extremely documentation-heavy - provide everything upfront',
      'Manufacturer warranty requirements help with system components',
      'Be prepared for multiple rebuttal rounds',
      'Consider reinspection request for disputed items'
    ],
    escalationPath: [
      'Field adjuster',
      'Inside adjuster/reviewer',
      'Claims supervisor',
      'Regional claims manager'
    ],
    typicalTimeline: '3-5 weeks for initial, can be lengthy rebuttal process',
    knownTendencies: [
      'Document-focused - thorough submissions get better results',
      'May require reinspection for disputed items',
      'O&P requires strong trade coordination evidence',
      'Responds to manufacturer requirements'
    ]
  },
  {
    carrier: 'USAA',
    commonObjectionPatterns: [
      'Step flashing reuse',
      'Ventilation matching',
      'Chimney flashing reuse',
      'Pre-existing conditions claimed'
    ],
    negotiationTips: [
      'Generally fair and efficient',
      'Responds well to clear, concise documentation',
      'Code citations highly effective',
      'Usually approves legitimate supplements quickly'
    ],
    escalationPath: [
      'Assigned adjuster',
      'Supervisor',
      'Member services'
    ],
    typicalTimeline: '1-2 weeks initial, quick rebuttal turnaround',
    knownTendencies: [
      'One of the more contractor-friendly carriers',
      'Values clear documentation',
      'Quick decision-making',
      'Fair pricing on most items'
    ]
  },
  {
    carrier: 'Farmers',
    commonObjectionPatterns: [
      'Ice & water shield not required',
      'Valley metal not necessary',
      'High charges questioned',
      'Permit fees disputed',
      'Regional pricing arguments'
    ],
    negotiationTips: [
      'Manufacturer specs help with IWS arguments',
      'LKQ arguments for matching components',
      'Local building department verification for permits',
      'Be persistent - may require multiple contacts'
    ],
    escalationPath: [
      'Field adjuster',
      'Claims examiner',
      'Claims manager',
      'District claims manager'
    ],
    typicalTimeline: '2-4 weeks for responses',
    knownTendencies: [
      'May use regional pricing arguments',
      'Sometimes requires local code verification',
      'Responds to manufacturer requirements',
      'May delay - persistence important'
    ]
  },
  {
    carrier: 'Liberty Mutual',
    commonObjectionPatterns: [
      'Drip edge reuse',
      'Starter in waste',
      'Labor hours questioned',
      'Decking requirements',
      'O&P disputes'
    ],
    negotiationTips: [
      'IRC R908.5 effective for replacement arguments',
      'EagleView waste disclaimers important',
      'Detailed labor justification needed',
      'Attic photos crucial for decking'
    ],
    escalationPath: [
      'Assigned adjuster',
      'Inside claims team',
      'Claims supervisor'
    ],
    typicalTimeline: '2-3 weeks for initial, 1-2 weeks per cycle',
    knownTendencies: [
      'Responsive to code arguments',
      'May push back on labor items',
      'Generally fair on material items',
      'Documentation quality matters'
    ]
  },
  {
    carrier: 'Nationwide',
    commonObjectionPatterns: [
      'Steep charge disputes',
      'Ventilation not covered',
      'Valley metal not required',
      'Regional pricing',
      'Permit requirements'
    ],
    negotiationTips: [
      'Xactimate pricing standards for steep charges',
      'IRC R806.2 for ventilation',
      'LKQ arguments for valley metal',
      'Local verification for permits'
    ],
    escalationPath: [
      'Assigned adjuster',
      'Claims department supervisor',
      'Regional claims office'
    ],
    typicalTimeline: '2-4 weeks typical',
    knownTendencies: [
      'Moderate difficulty level',
      'Responds to code citations',
      'May require persistence',
      'Generally fair when documented properly'
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get objections by category
 */
export function getObjectionsByCategory(category: CarrierObjection['category']): CarrierObjection[] {
  return CARRIER_OBJECTIONS.filter(o => o.category === category)
}

/**
 * Get objections common to a specific carrier
 */
export function getCarrierObjections(carrier: string): CarrierObjection[] {
  const carrierLower = carrier.toLowerCase()
  return CARRIER_OBJECTIONS.filter(o => 
    o.commonCarriers.some(c => c.toLowerCase().includes(carrierLower))
  )
}

/**
 * Get carrier profile
 */
export function getCarrierProfile(carrier: string): CarrierProfile | undefined {
  return CARRIER_PROFILES.find(p => 
    p.carrier.toLowerCase().includes(carrier.toLowerCase())
  )
}

/**
 * Find matching objection pattern
 */
export function findObjectionPattern(objectionText: string): CarrierObjection | undefined {
  const textLower = objectionText.toLowerCase()
  return CARRIER_OBJECTIONS.find(o => 
    o.objection.toLowerCase().split(' ').some(word => 
      word.length > 4 && textLower.includes(word)
    )
  )
}

/**
 * Get rebuttal template for an objection type
 */
export function getRebuttalTemplate(objectionKeyword: string): string | null {
  const keywordLower = objectionKeyword.toLowerCase()
  const objection = CARRIER_OBJECTIONS.find(o => 
    o.objection.toLowerCase().includes(keywordLower)
  )
  return objection?.rebuttalTemplate || null
}

/**
 * Get very common objections (most frequently encountered)
 */
export function getVeryCommonObjections(): CarrierObjection[] {
  return CARRIER_OBJECTIONS.filter(o => o.frequency === 'very_common')
}

/**
 * Get evidence checklist for an objection
 */
export function getEvidenceChecklist(objectionKeyword: string): string[] {
  const keywordLower = objectionKeyword.toLowerCase()
  const objection = CARRIER_OBJECTIONS.find(o => 
    o.objection.toLowerCase().includes(keywordLower)
  )
  return objection?.evidenceNeeded || []
}
