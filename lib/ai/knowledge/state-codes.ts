/**
 * State-Specific Code Amendments and Variations
 * 
 * Building codes vary by state. While the IRC provides baseline requirements,
 * many states have amendments that ADD requirements (rarely reduce them).
 * 
 * This database helps identify state-specific requirements that may justify
 * additional line items beyond standard IRC compliance.
 */

export interface StateCodeAmendment {
  state: string
  stateCode: string
  ircBaseCode: string
  amendment: string
  requirement: string
  impact: string
  defenseNote: string
  effectiveDate: string
}

export interface StateWindZone {
  state: string
  zones: WindZoneInfo[]
}

export interface WindZoneInfo {
  zoneName: string
  windSpeed: number // mph
  exposureCategory: string
  requirements: string[]
  xactimateImpact: string[]
}

export interface StateHailZone {
  state: string
  hailFrequency: 'low' | 'moderate' | 'high' | 'very_high'
  impactRatingRequirement: string | null
  notes: string
}

// ============================================
// STATE CODE AMENDMENTS - ROOFING SPECIFIC
// ============================================

export const STATE_AMENDMENTS: StateCodeAmendment[] = [
  // FLORIDA
  {
    state: 'Florida',
    stateCode: 'FBC R905.2.8.5.1',
    ircBaseCode: 'R905.2.8.5',
    amendment: 'Florida Building Code High-Velocity Hurricane Zone (HVHZ) Drip Edge Requirements',
    requirement: 'In HVHZ areas, drip edge must be minimum 26 gauge galvanized steel, stainless steel, or aluminum and installed with ring shank nails at 4" O.C.',
    impact: 'Higher grade drip edge material, closer nail spacing',
    defenseNote: 'Per Florida Building Code R905.2.8.5.1, drip edge in High-Velocity Hurricane Zones must be minimum 26 gauge and installed with ring shank nails at 4" O.C. This exceeds standard IRC requirements and justifies premium drip edge material costs.',
    effectiveDate: '2020'
  },
  {
    state: 'Florida',
    stateCode: 'FBC R905.2.7.1.1',
    ircBaseCode: 'R905.2.7.1',
    amendment: 'Florida Ice Barrier Alternative - Secondary Water Barrier',
    requirement: 'Florida requires a secondary water barrier (peel-and-stick or mechanically attached) covering the entire roof deck in HVHZ and portions of the state designated as wind-borne debris regions.',
    impact: 'Full roof deck peel-and-stick underlayment required, not just at eaves/valleys',
    defenseNote: 'Per FBC R905.2.7.1.1, Florida wind-borne debris regions require a secondary water barrier covering the ENTIRE roof deck, not just valleys and eaves as in standard IRC. This significantly increases underlayment material requirements.',
    effectiveDate: '2020'
  },
  {
    state: 'Florida',
    stateCode: 'FBC R905.2.6',
    ircBaseCode: 'R905.2.6',
    amendment: 'Florida Enhanced Attachment Requirements',
    requirement: 'Six (6) nails per shingle required in HVHZ (versus standard 4 nails). Enhanced adhesive requirements for ridge cap.',
    impact: 'Additional fasteners, enhanced labor time',
    defenseNote: 'Florida Building Code R905.2.6 requires 6 nails per shingle in HVHZ versus standard 4 nails. This 50% increase in fastener requirements adds labor time and material costs beyond standard pricing.',
    effectiveDate: '2020'
  },

  // TEXAS
  {
    state: 'Texas',
    stateCode: 'TRC 303.1.1',
    ircBaseCode: 'R301.2.1',
    amendment: 'Texas Windstorm Insurance Requirements',
    requirement: 'Coastal counties (first tier) require Texas Department of Insurance (TDI) windstorm certification. Enhanced connection and attachment requirements.',
    impact: 'TDI-certified materials, enhanced fastening, inspection requirements',
    defenseNote: 'Per Texas Residential Code 303.1.1, coastal counties require Texas Department of Insurance windstorm certification. This requires specific materials, enhanced attachment methods, and TDI inspection. These compliance costs are legitimate claim expenses.',
    effectiveDate: '2018'
  },
  {
    state: 'Texas',
    stateCode: 'TRC R905.2.8.5',
    ircBaseCode: 'R905.2.8.5',
    amendment: 'Texas Drip Edge with Roofing Cement',
    requirement: 'In wind zones of 110 mph and greater, drip edge must be set in roofing cement and fastened at 4" intervals.',
    impact: 'Roofing cement material and labor, closer fastener spacing',
    defenseNote: 'Texas amendments require drip edge set in roofing cement with 4" fastener spacing in high wind zones. This exceeds standard IRC installation and adds material and labor costs.',
    effectiveDate: '2018'
  },

  // OKLAHOMA
  {
    state: 'Oklahoma',
    stateCode: 'OBC amendments',
    ircBaseCode: 'R905.2.7.1',
    amendment: 'Oklahoma Ice Barrier Requirements',
    requirement: 'Ice barrier required in valleys and at eaves extending minimum 24" past exterior wall line. Enhanced requirements in northern counties.',
    impact: 'Ice and water shield required statewide in critical areas',
    defenseNote: 'Oklahoma Building Code requires ice barrier at eaves and valleys regardless of climate zone designation. This is a statewide requirement exceeding base IRC application in southern regions.',
    effectiveDate: '2021'
  },

  // COLORADO
  {
    state: 'Colorado',
    stateCode: 'CBC 1507.2.7.1',
    ircBaseCode: 'R905.2.7.1',
    amendment: 'Colorado Enhanced Ice Barrier',
    requirement: 'Due to high altitude and freeze-thaw cycles, ice barrier must extend minimum 36" past interior wall line (versus IRC 24").',
    impact: 'Extended ice barrier coverage at eaves',
    defenseNote: 'Colorado Building Code 1507.2.7.1 requires ice barrier extending 36" past interior wall line (versus standard 24" IRC). High altitude and severe freeze-thaw cycles justify this enhanced requirement.',
    effectiveDate: '2019'
  },
  {
    state: 'Colorado',
    stateCode: 'Local amendments',
    ircBaseCode: 'R301.2.1',
    amendment: 'Colorado Hail-Resistant Requirements',
    requirement: 'Many Colorado jurisdictions require Class 3 or Class 4 impact-resistant shingles. Denver metro and Front Range communities may have enhanced requirements.',
    impact: 'Impact-resistant shingles required or premium pricing',
    defenseNote: 'Colorado jurisdictions with hail-resistant requirements mandate Class 3 or Class 4 impact-resistant shingles. When Like Kind and Quality restoration requires impact-resistant materials, this premium is a legitimate claim expense.',
    effectiveDate: 'Varies by jurisdiction'
  },

  // LOUISIANA
  {
    state: 'Louisiana',
    stateCode: 'LSUBC 2022',
    ircBaseCode: 'R301.2.1',
    amendment: 'Louisiana Hurricane Provisions',
    requirement: 'Coastal parishes have enhanced wind requirements. New Orleans and surrounding areas require enhanced roof-to-wall connections.',
    impact: 'Hurricane clips, enhanced fastening, permit requirements',
    defenseNote: 'Louisiana State Uniform Building Code requires enhanced roof-to-wall connections in coastal and hurricane-prone parishes. Hurricane clips and enhanced fastening are code requirements, not optional upgrades.',
    effectiveDate: '2022'
  },

  // NORTH CAROLINA
  {
    state: 'North Carolina',
    stateCode: 'NCRC R301.2.1',
    ircBaseCode: 'R301.2.1',
    amendment: 'North Carolina Coastal Wind Requirements',
    requirement: 'Coastal counties are designated as wind-borne debris regions requiring enhanced attachment and secondary water barrier.',
    impact: 'Enhanced fastening, full deck secondary barrier in coastal areas',
    defenseNote: 'North Carolina coastal counties require wind-borne debris region compliance including enhanced roof attachment and secondary water barriers. These are code-mandated requirements.',
    effectiveDate: '2018'
  },

  // GEORGIA
  {
    state: 'Georgia',
    stateCode: 'GRC amendments',
    ircBaseCode: 'R905.2.8.5',
    amendment: 'Georgia Drip Edge Requirements',
    requirement: 'Drip edge required at all eaves and rakes. No exemptions for existing construction reroof.',
    impact: 'Drip edge mandatory even when replacing roofs without existing drip edge',
    defenseNote: 'Georgia requires drip edge at all eaves and rakes, including reroof of older homes that may not have had drip edge originally. LKQ restoration must meet current code which now mandates drip edge.',
    effectiveDate: '2020'
  },

  // SOUTH CAROLINA
  {
    state: 'South Carolina',
    stateCode: 'SCRC amendments',
    ircBaseCode: 'R301.2.1',
    amendment: 'South Carolina Coastal Requirements',
    requirement: 'Coastal counties require enhanced wind resistance. Barrier islands have strictest requirements.',
    impact: 'Enhanced attachment, wind-rated materials',
    defenseNote: 'South Carolina coastal counties have enhanced wind resistance requirements beyond standard IRC. These code requirements justify wind-rated materials and enhanced installation methods.',
    effectiveDate: '2019'
  },

  // MINNESOTA
  {
    state: 'Minnesota',
    stateCode: 'MRC 1507.2.7.1',
    ircBaseCode: 'R905.2.7.1',
    amendment: 'Minnesota Enhanced Ice Barrier',
    requirement: 'Ice barrier required on ALL roofs statewide - must extend minimum 24" past interior wall line. No climate zone exceptions.',
    impact: 'Ice barrier required throughout state',
    defenseNote: 'Minnesota requires ice barrier on ALL roofs statewide per MRC 1507.2.7.1, with no climate zone exceptions allowed. This is more stringent than base IRC which allows exceptions.',
    effectiveDate: '2020'
  },

  // KANSAS
  {
    state: 'Kansas',
    stateCode: 'Local amendments',
    ircBaseCode: 'R301.2.1',
    amendment: 'Kansas Hail Zone Requirements',
    requirement: 'Many Kansas jurisdictions have adopted impact-resistant roofing incentives or requirements, particularly in Wichita and surrounding areas.',
    impact: 'Impact-resistant shingles may be required or incentivized',
    defenseNote: 'Kansas hail-prone areas may require impact-resistant shingles (Class 3 or 4) per local amendments. When existing roof had impact-resistant materials, LKQ replacement requires matching products.',
    effectiveDate: 'Varies'
  },

  // NEBRASKA
  {
    state: 'Nebraska',
    stateCode: 'Local amendments',
    ircBaseCode: 'R905.2.7.1',
    amendment: 'Nebraska Ice Barrier and Hail Requirements',
    requirement: 'Eastern Nebraska (Omaha area) has adopted ice barrier requirements. Some jurisdictions require impact-resistant roofing.',
    impact: 'Ice barrier and possible impact-resistant requirements',
    defenseNote: 'Nebraska local jurisdictions, particularly Omaha metro, have adopted ice barrier requirements and may require impact-resistant shingles in hail-prone zones.',
    effectiveDate: 'Varies'
  }
]

// ============================================
// WIND ZONE INFORMATION BY STATE
// ============================================

export const STATE_WIND_ZONES: StateWindZone[] = [
  {
    state: 'Florida',
    zones: [
      {
        zoneName: 'HVHZ (High-Velocity Hurricane Zone)',
        windSpeed: 180,
        exposureCategory: 'C',
        requirements: [
          'Miami-Dade or Florida Product Approval required',
          'Enhanced attachment - 6 nails per shingle',
          'Secondary water barrier full deck',
          'Ring shank nails for drip edge at 4" O.C.'
        ],
        xactimateImpact: ['Premium materials', 'Enhanced labor', 'Permit fees']
      },
      {
        zoneName: 'Wind-Borne Debris Region',
        windSpeed: 140,
        exposureCategory: 'B/C',
        requirements: [
          'Secondary water barrier recommended',
          'Enhanced attachment in exposed areas',
          'Florida Product Approval required'
        ],
        xactimateImpact: ['Enhanced materials', 'Additional underlayment']
      }
    ]
  },
  {
    state: 'Texas',
    zones: [
      {
        zoneName: 'Coastal First Tier Counties',
        windSpeed: 150,
        exposureCategory: 'C',
        requirements: [
          'TDI Windstorm Certification required',
          'WPI-8 form for inspection',
          'Enhanced roof-to-wall connections',
          'Drip edge set in cement at 4" O.C.'
        ],
        xactimateImpact: ['TDI inspection fees', 'Enhanced materials', 'Certification costs']
      }
    ]
  },
  {
    state: 'Louisiana',
    zones: [
      {
        zoneName: 'Coastal Parishes',
        windSpeed: 150,
        exposureCategory: 'C',
        requirements: [
          'Hurricane clips required',
          'Enhanced fastening schedule',
          'Local permit and inspection'
        ],
        xactimateImpact: ['Hurricane clips', 'Enhanced labor', 'Permit fees']
      }
    ]
  },
  {
    state: 'North Carolina',
    zones: [
      {
        zoneName: 'Coastal Counties',
        windSpeed: 140,
        exposureCategory: 'C',
        requirements: [
          'Wind-borne debris region compliance',
          'Secondary water barrier',
          'Enhanced attachment'
        ],
        xactimateImpact: ['Full deck underlayment', 'Enhanced fastening']
      }
    ]
  }
]

// ============================================
// HAIL ZONE INFORMATION
// ============================================

export const HAIL_ZONES: StateHailZone[] = [
  {
    state: 'Texas',
    hailFrequency: 'very_high',
    impactRatingRequirement: 'Class 3 or 4 recommended/required in many areas',
    notes: 'North Texas (DFW), San Antonio, Austin areas are extremely hail-prone. Many insurers offer discounts for impact-resistant shingles.'
  },
  {
    state: 'Oklahoma',
    hailFrequency: 'very_high',
    impactRatingRequirement: 'Class 3 or 4 recommended',
    notes: 'Entire state is in Tornado Alley with frequent severe hail. Oklahoma City and Tulsa metros especially affected.'
  },
  {
    state: 'Kansas',
    hailFrequency: 'very_high',
    impactRatingRequirement: 'Class 3 or 4 may be required locally',
    notes: 'Wichita and surrounding areas have high hail frequency. Some jurisdictions have adopted impact-resistant requirements.'
  },
  {
    state: 'Nebraska',
    hailFrequency: 'high',
    impactRatingRequirement: 'Recommended in eastern areas',
    notes: 'Omaha and Lincoln areas experience significant hail events. Impact-resistant materials increasingly common.'
  },
  {
    state: 'Colorado',
    hailFrequency: 'very_high',
    impactRatingRequirement: 'Class 4 required in many Front Range jurisdictions',
    notes: 'Denver metro and Front Range have extremely high hail frequency. Many jurisdictions mandate impact-resistant roofing.'
  },
  {
    state: 'Minnesota',
    hailFrequency: 'high',
    impactRatingRequirement: 'Recommended',
    notes: 'Twin Cities and southern Minnesota experience significant hail. Insurance incentives for impact-resistant materials.'
  },
  {
    state: 'Missouri',
    hailFrequency: 'high',
    impactRatingRequirement: 'Recommended in metro areas',
    notes: 'Kansas City and St. Louis areas have high hail exposure.'
  },
  {
    state: 'Iowa',
    hailFrequency: 'high',
    impactRatingRequirement: 'Recommended',
    notes: 'Des Moines and surrounding areas experience regular hail events.'
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get state-specific code amendments
 */
export function getStateAmendments(state: string): StateCodeAmendment[] {
  return STATE_AMENDMENTS.filter(a => 
    a.state.toLowerCase() === state.toLowerCase()
  )
}

/**
 * Get wind zone information for a state
 */
export function getStateWindZones(state: string): StateWindZone | undefined {
  return STATE_WIND_ZONES.find(w => 
    w.state.toLowerCase() === state.toLowerCase()
  )
}

/**
 * Get hail zone information for a state
 */
export function getStateHailZone(state: string): StateHailZone | undefined {
  return HAIL_ZONES.find(h => 
    h.state.toLowerCase() === state.toLowerCase()
  )
}

/**
 * Check if state is high-wind coastal zone
 */
export function isCoastalWindZone(state: string): boolean {
  const coastalStates = ['Florida', 'Texas', 'Louisiana', 'North Carolina', 'South Carolina', 'Georgia']
  return coastalStates.some(s => s.toLowerCase() === state.toLowerCase())
}

/**
 * Check if state is in high hail frequency zone
 */
export function isHighHailZone(state: string): boolean {
  const zone = getStateHailZone(state)
  return zone?.hailFrequency === 'high' || zone?.hailFrequency === 'very_high'
}

/**
 * Get defense note for state-specific requirement
 */
export function getStateDefenseNote(state: string, ircCode: string): string | null {
  const amendment = STATE_AMENDMENTS.find(a => 
    a.state.toLowerCase() === state.toLowerCase() && 
    a.ircBaseCode === ircCode
  )
  return amendment?.defenseNote || null
}

/**
 * Get all state-specific requirements that exceed standard IRC
 */
export function getEnhancedRequirements(state: string): StateCodeAmendment[] {
  return STATE_AMENDMENTS.filter(a => 
    a.state.toLowerCase() === state.toLowerCase()
  )
}
