/**
 * Damage Pattern Identification and Photo Documentation Standards
 * 
 * Knowledge for identifying storm damage types and documenting them properly.
 * Helps distinguish between storm damage, wear, and manufacturing defects.
 */

export interface DamagePattern {
  type: string
  category: 'hail' | 'wind' | 'age' | 'mechanical' | 'manufacturing' | 'improper_installation'
  characteristics: string[]
  identificationTips: string[]
  commonMistakes: string[]
  photoRequirements: string[]
  defenseNote: string
}

export interface PhotoRequirement {
  category: string
  requiredShots: PhotoShot[]
  tips: string[]
}

export interface PhotoShot {
  name: string
  description: string
  purpose: string
  bestPractices: string[]
}

// ============================================
// HAIL DAMAGE PATTERNS
// ============================================

export const HAIL_DAMAGE_PATTERNS: DamagePattern[] = [
  {
    type: 'Composition Shingle Hail Damage',
    category: 'hail',
    characteristics: [
      'Random pattern across roof surface (not aligned with shingle edges)',
      'Soft spots when pressing - mat is compromised',
      'Granule displacement at impact points',
      'Exposed fiberglass mat or black substrate visible',
      'Circular or semi-circular impact marks',
      'No pattern to damage - appears randomly scattered',
      'Damage typically on all elevations exposed to storm direction',
      'Fractures in shingle mat may crack when bent'
    ],
    identificationTips: [
      'Run hand across shingle to feel for soft/spongy spots',
      'Look for loss of granules in circular patterns',
      'Check both sunny and shaded areas (damage should be consistent)',
      'Damage is typically NOT in straight lines (that indicates foot traffic)',
      'Hail impacts at random angles - check multiple shingles',
      'Damage appears on same elevation as damaged vents/metal'
    ],
    commonMistakes: [
      'Confusing blistering (manufacturing defect) with hail',
      'Mistaking granule loss from age as hail damage',
      'Not checking for soft spots underneath granule loss',
      'Only documenting one area instead of entire roof'
    ],
    photoRequirements: [
      'Wide overview showing damage pattern across roof',
      'Medium shot showing multiple hits in one area',
      'Close-up of individual impact with ruler/coin for scale',
      'Photo showing soft spot with finger depression',
      'Photos on all affected elevations'
    ],
    defenseNote: 'Hail damage to composition shingles presents as random-pattern impacts with granule displacement and compromised mat integrity. Photos document [X] impacts per test square with characteristic soft spots indicating mat fracture. This damage pattern is consistent with hail impact and not normal wear or manufacturing defects.'
  },
  {
    type: 'Metal Component Hail Damage',
    category: 'hail',
    characteristics: [
      'Dents in metal surfaces (vents, gutters, flashing)',
      'Dents are round or semi-round',
      'Random dent pattern (not in rows)',
      'Dent depth varies based on hail size',
      'Paint may be cracked or chipped at impact points',
      'Soft metals (aluminum) show more pronounced dents'
    ],
    identificationTips: [
      'Metal damage corroborates shingle damage',
      'Check roof vents, exhaust caps, drip edge, valley metal',
      'Gutter crowns often show excellent hail evidence',
      'AC condensers and window screens provide ground-level evidence',
      'Check ALL metal components - damage should be consistent'
    ],
    commonMistakes: [
      'Not documenting metal damage as corroborating evidence',
      'Focusing only on shingles',
      'Missing damage on painted drip edge'
    ],
    photoRequirements: [
      'Each damaged metal component photographed',
      'Close-up of individual dents with measurement reference',
      'Photos showing dent pattern across component',
      'Ground-level metal damage (AC units, window screens) as corroboration'
    ],
    defenseNote: 'Metal components show impact dents consistent with hail damage. Dent pattern on [component] corroborates shingle damage and confirms hail event. Metal damage is indisputable evidence of impact that cannot be attributed to wear or manufacturing.'
  },
  {
    type: 'Flat Roof/Modified Bitumen Hail Damage',
    category: 'hail',
    characteristics: [
      'Circular fractures in membrane surface',
      'Exposed fiberglass or polyester reinforcement',
      'Impact marks in granule surface coating',
      'Soft spots in membrane where impact fractured layers'
    ],
    identificationTips: [
      'Look for circular fracture patterns',
      'Check for exposed reinforcement scrim',
      'Feel for soft spots indicating layer separation'
    ],
    commonMistakes: [
      'Confusing weathering cracks with hail impacts',
      'Not checking for underlying membrane damage'
    ],
    photoRequirements: [
      'Overview of affected membrane area',
      'Close-up of individual impacts with scale reference',
      'Photos showing exposed reinforcement'
    ],
    defenseNote: 'Modified bitumen membrane shows hail impact damage with characteristic circular fractures and exposed reinforcement scrim. Impact pattern is random and consistent with hail event, not weathering or foot traffic.'
  }
]

// ============================================
// WIND DAMAGE PATTERNS
// ============================================

export const WIND_DAMAGE_PATTERNS: DamagePattern[] = [
  {
    type: 'Shingle Lifting/Creasing',
    category: 'wind',
    characteristics: [
      'Shingles lifted at tabs or edges',
      'Visible crease line across shingle where wind flexed it',
      'Seal strip broken on affected shingles',
      'Damage typically on windward elevations',
      'Pattern follows wind direction across roof'
    ],
    identificationTips: [
      'Creased shingles will not lay flat again',
      'Check seal strip - once broken, shingle is compromised',
      'Wind damage often worst at edges, ridges, hips',
      'Look for pattern matching documented storm wind direction'
    ],
    commonMistakes: [
      'Confusing normal thermal lifting with wind damage',
      'Not checking seal strips under lifted shingles',
      'Missing creases that indicate permanent damage'
    ],
    photoRequirements: [
      'Overview showing pattern of lifted shingles',
      'Close-up showing crease line across shingle',
      'Photo showing broken seal strip',
      'Wide shot showing damage on windward elevation'
    ],
    defenseNote: 'Shingles exhibit wind damage with characteristic creasing and broken seal strips. Once creased, shingles cannot reseal and are permanently compromised. Damage pattern on [elevation] is consistent with [documented storm wind direction].'
  },
  {
    type: 'Missing Shingles/Tabs',
    category: 'wind',
    characteristics: [
      'Complete shingles or tabs missing',
      'Exposed underlayment or deck visible',
      'Remaining shingle torn at nail line',
      'Adjacent shingles may be lifted or creased'
    ],
    identificationTips: [
      'Check if missing tabs follow wind direction pattern',
      'Look for tear patterns indicating wind vs mechanical removal',
      'Document all missing material and exposed areas'
    ],
    commonMistakes: [
      'Not documenting full extent of missing material',
      'Missing adjacent damage around missing shingles'
    ],
    photoRequirements: [
      'Overview showing location of missing shingles',
      'Close-up of torn edges where material separated',
      'Photos of all areas with missing material',
      'Photo showing exposed underlayment/deck'
    ],
    defenseNote: 'Wind damage resulted in missing shingles/tabs with characteristic tear pattern. Exposed underlayment/deck at [location]. Full roof replacement required to properly repair damage and maintain weathertight assembly.'
  },
  {
    type: 'Ridge Cap Wind Damage',
    category: 'wind',
    characteristics: [
      'Ridge cap shingles lifted or missing',
      'Seal failure along ridge line',
      'Exposed ridge vent or deck at ridge',
      'Multiple ridge caps affected'
    ],
    identificationTips: [
      'Ridge is most vulnerable to wind - check thoroughly',
      'Look for pattern of seal failure',
      'Check both sides of ridge for damage consistency'
    ],
    commonMistakes: [
      'Only replacing obviously missing caps',
      'Not checking seal on caps that appear in place'
    ],
    photoRequirements: [
      'Full ridge line photo showing damage extent',
      'Close-up of lifted/damaged ridge caps',
      'Photo showing missing caps and exposed area'
    ],
    defenseNote: 'Ridge cap shingles show wind damage with lifted/missing caps and broken seals. Ridge line is most vulnerable to wind due to exposure from both sides. Full ridge cap replacement required for proper repair.'
  }
]

// ============================================
// DISTINGUISHING DAMAGE FROM OTHER CONDITIONS
// ============================================

export const NON_STORM_CONDITIONS: DamagePattern[] = [
  {
    type: 'Blistering (Manufacturing Defect)',
    category: 'manufacturing',
    characteristics: [
      'Raised bubbles in shingle surface',
      'Blisters may be open or closed',
      'Pattern NOT random - follows manufacturing lot',
      'No soft spots underneath - mat is intact',
      'Often appears on south-facing slopes first (heat exposure)'
    ],
    identificationTips: [
      'Blisters feel different than hail - harder, hollow',
      'Pattern follows manufacturing, not storm direction',
      'No corroborating damage on metal components',
      'Press test shows mat is NOT compromised'
    ],
    commonMistakes: [
      'Confusing blistering with hail damage',
      'Not doing press test to check mat integrity',
      'Assuming all granule loss is from impacts'
    ],
    photoRequirements: [
      'Photos showing blister pattern',
      'Close-up of individual blisters',
      'Photos showing pattern follows manufacturing'
    ],
    defenseNote: 'This condition is blistering, a manufacturing defect, NOT storm damage. Characteristics include: raised bubbles without mat compromise, pattern following manufacturing rather than random storm impact, and no corroborating damage on metal components. May be manufacturer warranty claim.'
  },
  {
    type: 'Normal Aging/Weathering',
    category: 'age',
    characteristics: [
      'Gradual granule loss across entire surface',
      'Curling at shingle edges',
      'Cracking along shingle surface',
      'Loss of flexibility',
      'Exposed fiberglass at edges (not impacts)'
    ],
    identificationTips: [
      'Wear pattern is uniform, not random impacts',
      'No soft spots - just brittle/aged material',
      'Damage consistent across all elevations',
      'South-facing slopes typically more worn'
    ],
    commonMistakes: [
      'Confusing age-related granule loss with hail damage',
      'Not distinguishing curling from wind lifting'
    ],
    photoRequirements: [
      'Overall condition photos',
      'Close-up showing wear pattern',
      'Comparison between elevations'
    ],
    defenseNote: 'This condition represents normal aging and weathering, not storm damage. Pattern is uniform wear rather than random impact damage, and no corroborating damage exists on metal components.'
  },
  {
    type: 'Mechanical Damage (Foot Traffic)',
    category: 'mechanical',
    characteristics: [
      'Damage in straight lines or paths',
      'Scuff marks and granule displacement in patterns',
      'Damage concentrated around HVAC, vents, or access points',
      'Broken or cracked shingles in traffic areas'
    ],
    identificationTips: [
      'Traffic damage follows logical walking paths',
      'Damage near access points (ladders, hatches)',
      'Pattern is NOT random like hail',
      'No corroborating metal damage'
    ],
    commonMistakes: [
      'Confusing foot traffic scuffs with hail damage',
      'Not recognizing walking patterns'
    ],
    photoRequirements: [
      'Wide shot showing traffic pattern',
      'Photos showing damage path',
      'Comparison with undamaged areas'
    ],
    defenseNote: 'This condition is mechanical damage from foot traffic, not storm damage. Pattern follows logical walking paths around roof access points. Random hail impact pattern not present.'
  },
  {
    type: 'Improper Installation',
    category: 'improper_installation',
    characteristics: [
      'High nailing (nails above nail line)',
      'Exposed nails',
      'Improper overlap',
      'Shingles installed crooked or misaligned',
      'Flashing not properly integrated'
    ],
    identificationTips: [
      'Check nail placement on lifted shingles',
      'Look for exposed fasteners',
      'Check overlap dimensions against specs'
    ],
    commonMistakes: [
      'Not identifying installation issues',
      'Attributing installation failure to storm'
    ],
    photoRequirements: [
      'Photos showing specific installation defects',
      'Nail placement photos',
      'Overall installation quality documentation'
    ],
    defenseNote: 'This condition results from improper installation, not storm damage. [Specific defect] does not meet manufacturer installation requirements or building code. May be contractor warranty/workmanship claim.'
  }
]

// ============================================
// PHOTO DOCUMENTATION STANDARDS
// ============================================

export const PHOTO_DOCUMENTATION: PhotoRequirement[] = [
  {
    category: 'Overall Documentation',
    requiredShots: [
      {
        name: 'Four Elevations',
        description: 'Ground-level photo of each side of house',
        purpose: 'Document building height, overall condition, and all elevations',
        bestPractices: [
          'Stand back far enough to capture entire elevation',
          'Include some sky and ground for reference',
          'Capture on all four sides'
        ]
      },
      {
        name: 'Roof Overview',
        description: 'Wide-angle shots from corners showing multiple roof planes',
        purpose: 'Document overall roof condition and damage distribution',
        bestPractices: [
          'Capture from each corner looking across roof',
          'Show multiple roof planes in one shot',
          'Document entire roof surface systematically'
        ]
      },
      {
        name: 'Address Photo',
        description: 'Photo showing house number/address',
        purpose: 'Verify property location for documentation',
        bestPractices: [
          'Clear, readable address',
          'Include in early documentation'
        ]
      }
    ],
    tips: [
      'Take overall shots BEFORE close-ups',
      'Document systematically - dont skip areas',
      'Include date/time stamp if possible'
    ]
  },
  {
    category: 'Damage Documentation',
    requiredShots: [
      {
        name: 'Damage Test Square',
        description: '10x10 area with damage impacts marked',
        purpose: 'Quantify damage density (hits per square)',
        bestPractices: [
          'Use chalk or tape to mark 10x10 square',
          'Mark each impact point',
          'Take photo clearly showing marked area',
          'Document multiple test squares on different slopes'
        ]
      },
      {
        name: 'Medium Context Shot',
        description: 'Photo showing damage in context (several shingles)',
        purpose: 'Show damage pattern and distribution',
        bestPractices: [
          'Include multiple damaged areas in frame',
          'Show relationship between damage points',
          'Establish that pattern is random (hail) vs linear (mechanical)'
        ]
      },
      {
        name: 'Close-Up with Scale',
        description: 'Individual damage point with ruler/coin for scale',
        purpose: 'Document damage size and characteristics',
        bestPractices: [
          'Include size reference (coin, ruler)',
          'Focus on single impact point',
          'Show granule loss, soft spot, or crease clearly',
          'Multiple close-ups across different areas'
        ]
      }
    ],
    tips: [
      'Always include scale reference in close-ups',
      'Wide-medium-close sequence tells the story',
      'Document damage on ALL affected elevations'
    ]
  },
  {
    category: 'Component Documentation',
    requiredShots: [
      {
        name: 'Each Roof Component',
        description: 'Individual photo of vents, boots, flashings, etc.',
        purpose: 'Document condition of all replaceable components',
        bestPractices: [
          'Photograph every pipe jack/boot',
          'Capture all vents (box, ridge, power)',
          'Document all flashing conditions',
          'Include close-up if damage present'
        ]
      },
      {
        name: 'Valley Photos',
        description: 'Full length of each valley',
        purpose: 'Document valley metal condition and IWS requirements',
        bestPractices: [
          'Capture full valley length',
          'Show valley type (open metal vs closed)',
          'Document any debris or wear'
        ]
      },
      {
        name: 'Edge Conditions',
        description: 'Drip edge, starter, edge details',
        purpose: 'Document edge components for code compliance',
        bestPractices: [
          'Show drip edge presence/condition',
          'Document starter course',
          'Capture rake and eave edges'
        ]
      }
    ],
    tips: [
      'Count and document every penetration',
      'Note quantities as you photograph',
      'Metal component damage corroborates storm claim'
    ]
  },
  {
    category: 'Corroborating Evidence',
    requiredShots: [
      {
        name: 'Metal Components',
        description: 'All metal surfaces on roof',
        purpose: 'Corroborate hail with indisputable metal damage',
        bestPractices: [
          'Photograph all metal: vents, caps, drip edge, valley',
          'Close-up of individual dents with scale',
          'Document dent pattern'
        ]
      },
      {
        name: 'Ground Level Evidence',
        description: 'AC units, window screens, outdoor furniture',
        purpose: 'Corroborate storm event with ground-level evidence',
        bestPractices: [
          'Check AC condenser fins and housing',
          'Document damaged window screens',
          'Photograph any outdoor items with damage'
        ]
      },
      {
        name: 'Neighboring Properties',
        description: 'Adjacent properties showing damage (with permission)',
        purpose: 'Establish storm path and area-wide damage',
        bestPractices: [
          'Only photograph from public areas or with permission',
          'Note if neighbors have filed claims or replaced roofs'
        ]
      }
    ],
    tips: [
      'Metal damage is irrefutable evidence',
      'Ground-level evidence is easy for adjusters to verify',
      'Area-wide damage supports storm event claims'
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get damage pattern information by type
 */
export function getDamagePattern(type: string): DamagePattern | undefined {
  const allPatterns = [...HAIL_DAMAGE_PATTERNS, ...WIND_DAMAGE_PATTERNS, ...NON_STORM_CONDITIONS]
  return allPatterns.find(p => 
    p.type.toLowerCase().includes(type.toLowerCase())
  )
}

/**
 * Get all patterns for a damage category
 */
export function getPatternsByCategory(category: DamagePattern['category']): DamagePattern[] {
  const allPatterns = [...HAIL_DAMAGE_PATTERNS, ...WIND_DAMAGE_PATTERNS, ...NON_STORM_CONDITIONS]
  return allPatterns.filter(p => p.category === category)
}

/**
 * Get photo requirements for a category
 */
export function getPhotoRequirements(category: string): PhotoRequirement | undefined {
  return PHOTO_DOCUMENTATION.find(p => 
    p.category.toLowerCase().includes(category.toLowerCase())
  )
}

/**
 * Determine if described condition sounds like storm damage vs other
 */
export function assessDamageType(characteristics: string[]): {
  likelyType: 'storm' | 'non-storm' | 'unclear'
  reasoning: string[]
} {
  const stormIndicators = [
    'random pattern',
    'soft spots',
    'metal damage',
    'corroborating',
    'multiple elevations',
    'impact'
  ]
  
  const nonStormIndicators = [
    'pattern follows',
    'uniform wear',
    'straight lines',
    'manufacturing',
    'age',
    'traffic path'
  ]
  
  const charString = characteristics.join(' ').toLowerCase()
  
  const stormScore = stormIndicators.filter(i => charString.includes(i)).length
  const nonStormScore = nonStormIndicators.filter(i => charString.includes(i)).length
  
  if (stormScore > nonStormScore + 1) {
    return {
      likelyType: 'storm',
      reasoning: ['Random damage pattern', 'Multiple indicators of impact damage']
    }
  } else if (nonStormScore > stormScore + 1) {
    return {
      likelyType: 'non-storm',
      reasoning: ['Pattern suggests wear, manufacturing, or mechanical damage']
    }
  }
  
  return {
    likelyType: 'unclear',
    reasoning: ['Additional documentation needed to determine damage cause']
  }
}
