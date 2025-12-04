/**
 * OSHA Safety Requirements for Roofing
 * 
 * 29 CFR 1926 Subpart M - Fall Protection requirements for construction
 * These requirements justify supervisor hours, safety charges, and equipment costs.
 * 
 * IMPORTANT: OSHA compliance is mandatory. Carriers cannot deny legitimate
 * safety-related line items when work requires compliance with these standards.
 */

export interface OSHARequirement {
  standard: string
  title: string
  requirement: string
  applicableSituations: string[]
  xactimateImpact: string[]
  defenseNote: string
}

export interface SafetyCharge {
  code: string
  description: string
  trigger: string
  oshaReference: string
  defenseNote: string
}

// ============================================
// OSHA 29 CFR 1926 SUBPART M - FALL PROTECTION
// ============================================

export const OSHA_FALL_PROTECTION: OSHARequirement[] = [
  {
    standard: '1926.501(b)(10)',
    title: 'Roofing Work on Low-Slope Roofs',
    requirement: 'Each employee engaged in roofing activities on low-slope roofs with unprotected sides and edges 6 feet or more above lower levels shall be protected from falling by guardrail systems, safety net systems, or personal fall arrest systems, or a combination of warning line system and guardrail system, warning line system and safety net system, warning line system and personal fall arrest system, or warning line system and safety monitoring system.',
    applicableSituations: [
      'Any roof work 6 feet or more above ground',
      'Low-slope roofs (4/12 or less)',
      'Commercial flat roof work',
      'Residential work on porches, additions, garages with flat roofs'
    ],
    xactimateImpact: ['RFGSUPR', 'Safety equipment charges', 'Setup time for warning lines'],
    defenseNote: 'Per OSHA 29 CFR 1926.501(b)(10), fall protection is REQUIRED for roofing work 6 feet or more above lower levels. This includes personal fall arrest systems, warning lines, and safety monitoring. Supervision and safety setup time are mandated compliance costs, not optional.'
  },
  {
    standard: '1926.501(b)(11)',
    title: 'Steep Roofs',
    requirement: 'Each employee on a steep roof with unprotected sides and edges 6 feet or more above lower levels shall be protected from falling by guardrail systems with toeboards, safety net systems, or personal fall arrest systems.',
    applicableSituations: [
      'Steep roofs (greater than 4/12 pitch)',
      'Any roof where workers cannot walk without sliding',
      'Residential steep-slope roofing',
      'Most composition shingle reroof projects'
    ],
    xactimateImpact: ['RFGSTEEP', 'RFGSTEEP+', 'RFGSTEEP++', 'RFGSUPR', 'Harness/safety equipment'],
    defenseNote: 'Per OSHA 29 CFR 1926.501(b)(11), steep roof work (>4/12 pitch) at 6+ feet height requires personal fall arrest systems, guardrails with toeboards, or safety nets. Steep charges include the additional labor for safety compliance - workers in harnesses operate at reduced productivity due to safety equipment constraints.'
  },
  {
    standard: '1926.502(d)',
    title: 'Personal Fall Arrest Systems',
    requirement: 'Personal fall arrest systems must meet specific criteria: limit free fall to 6 feet, total fall distance must not contact lower level, maximum arresting force of 1,800 pounds, bring employee to complete stop and limit deceleration distance to 3.5 feet.',
    applicableSituations: [
      'Any work requiring harness use',
      'Steep pitch roofing (7/12+)',
      'Two-story or higher structures',
      'Work near unprotected edges'
    ],
    xactimateImpact: ['Safety harness setup time', 'RFGSUPR', 'Anchor point installation'],
    defenseNote: 'OSHA 29 CFR 1926.502(d) mandates personal fall arrest systems meeting specific performance criteria for steep/high work. Setup and breakdown of harness systems, anchor point verification, and reduced work pace while harnessed are legitimate labor costs required for OSHA compliance.'
  },
  {
    standard: '1926.502(e)',
    title: 'Positioning Device Systems',
    requirement: 'Body belt systems shall be rigged such that an employee cannot free fall more than 2 feet.',
    applicableSituations: [
      'Work requiring positioning while elevated',
      'Edge work on steep roofs',
      'Chimney flashing work at heights'
    ],
    xactimateImpact: ['Positioning equipment charges', 'Additional labor hours'],
    defenseNote: 'OSHA 29 CFR 1926.502(e) requires positioning device systems for elevated work limiting free fall to 2 feet. Specialized equipment and setup time are compliance requirements.'
  },
  {
    standard: '1926.502(h)',
    title: 'Safety Monitoring Systems',
    requirement: 'When used, a safety monitoring system shall be implemented by a competent person who has the authority and obligation to warn employees of fall hazards.',
    applicableSituations: [
      'Warning line system zones',
      'Low-slope roof work',
      'Situations where other fall protection is infeasible'
    ],
    xactimateImpact: ['RFGSUPR', 'Superintendent hours', 'Safety monitor labor'],
    defenseNote: 'OSHA 29 CFR 1926.502(h) requires a competent person for safety monitoring - this individual must devote their attention exclusively to monitoring and cannot perform other work duties. This justifies dedicated supervision hours for safety compliance.'
  },
  {
    standard: '1926.503',
    title: 'Training Requirements',
    requirement: 'The employer shall provide a training program for each employee who might be exposed to fall hazards. Training shall include nature of fall hazards, correct procedures for installation/disassembly of fall protection systems, and limitations of fall protection systems.',
    applicableSituations: [
      'All roofing projects at 6+ feet',
      'Any project requiring fall protection equipment',
      'Projects with multiple workers'
    ],
    xactimateImpact: ['Training costs', 'Competent person requirements'],
    defenseNote: 'OSHA 29 CFR 1926.503 mandates fall protection training for all workers exposed to fall hazards. Trained workers command premium labor rates, and projects require competent persons who have received specific safety training.'
  }
]

// ============================================
// HEIGHT AND PITCH THRESHOLDS
// ============================================

export const SAFETY_THRESHOLDS = {
  fallProtectionRequired: {
    heightThreshold: '6 feet',
    description: 'Fall protection required for work 6 feet or more above lower level',
    oshaReference: '1926.501(b)(10) and (b)(11)',
    defenseNote: 'Per OSHA, fall protection is required for ALL construction work 6 feet or more above lower levels. Two-story structures always exceed this threshold.'
  },
  steepRoofDefinition: {
    pitchThreshold: '4/12',
    description: 'Roofs with slopes greater than 4:12 are considered steep for OSHA purposes',
    oshaReference: '1926.500(b) definitions',
    defenseNote: 'OSHA defines steep roofs as those with slopes greater than 4:12. Most residential roofs fall into this category, requiring enhanced fall protection measures.'
  },
  lowSlopeRoofDefinition: {
    pitchThreshold: '4/12 or less',
    description: 'Roofs with slopes of 4:12 or less are considered low-slope',
    oshaReference: '1926.500(b) definitions',
    defenseNote: 'Low-slope roofs (4:12 or less) have different fall protection options under OSHA, but protection is still required at 6+ feet.'
  }
}

// ============================================
// SAFETY-RELATED XACTIMATE CHARGES
// ============================================

export const SAFETY_CHARGES: SafetyCharge[] = [
  {
    code: 'RFGSTEEP',
    description: 'Additional charge for steep roof - 7/12 to 9/12 slope',
    trigger: 'Roof pitch 7/12 to 9/12',
    oshaReference: '1926.501(b)(11) - Steep roof fall protection required',
    defenseNote: 'Steep charge (7/12-9/12) includes additional labor for OSHA-mandated fall protection. Workers in harnesses operate at reduced productivity - Xactimate steep charges reflect this reality. Photos document [X]/12 pitch requiring safety equipment and reduced work pace.'
  },
  {
    code: 'RFGSTEEP+',
    description: 'Additional charge for steep roof - 10/12 to 12/12 slope',
    trigger: 'Roof pitch 10/12 to 12/12',
    oshaReference: '1926.501(b)(11), 1926.502(d) - Enhanced fall protection required',
    defenseNote: 'Very steep pitch (10/12-12/12) requires full personal fall arrest systems per OSHA 1926.502(d). Workers cannot safely operate without harnesses at this pitch. Dramatically reduced productivity reflected in steep charge. Photos document extreme pitch requiring comprehensive safety measures.'
  },
  {
    code: 'RFGSTEEP++',
    description: 'Additional charge for steep roof - greater than 12/12 slope',
    trigger: 'Roof pitch greater than 12/12',
    oshaReference: '1926.501(b)(11), 1926.502(d) - Maximum fall protection required',
    defenseNote: 'Extreme steep pitch (>12/12) requires maximum fall protection per OSHA. Workers must be harnessed at all times with minimal mobility. This pitch category has the lowest productivity factor in the industry.'
  },
  {
    code: 'RFGHIGH+',
    description: 'Additional charge for high roof (2 stories or greater)',
    trigger: 'Building height of 2 or more stories',
    oshaReference: '1926.501 - Fall protection required at 6+ feet',
    defenseNote: 'Two-story or higher structures exceed OSHA 6-foot threshold requiring fall protection. Additional labor for material handling (carrying bundles up multiple stories), fall protection setup, and OSHA compliance. Photos document [X]-story structure requiring high roof safety protocols.'
  },
  {
    code: 'RFGSUPR',
    description: 'Supervisor/Safety Monitor Hours',
    trigger: 'Steep pitch (>5/12), 2+ stories, or complex safety requirements',
    oshaReference: '1926.502(h) - Safety monitoring system requirements',
    defenseNote: 'OSHA 29 CFR 1926.502(h) requires a competent person for safety monitoring on steep/high projects. This person must devote attention exclusively to monitoring and cannot perform other duties. Supervisor hours are a MANDATORY safety compliance cost, not optional overhead.'
  },
  {
    code: 'LABRFG',
    description: 'Additional Roofer Hours - Safety Setup/Breakdown',
    trigger: 'Projects requiring fall protection equipment',
    oshaReference: '1926.502 - Fall protection systems setup requirements',
    defenseNote: 'Additional labor hours required for OSHA-mandated safety equipment setup and breakdown. Harness systems, anchor points, warning lines, and toeboards require setup time not included in production rates. This is a compliance cost, not optional.'
  }
]

// ============================================
// COMPETENT PERSON REQUIREMENTS
// ============================================

export const COMPETENT_PERSON_REQUIREMENTS = {
  definition: 'One who is capable of identifying existing and predictable hazards in the surroundings or working conditions which are unsanitary, hazardous, or dangerous to employees, and who has authorization to take prompt corrective measures to eliminate them.',
  oshaReference: '1926.32(f)',
  requirement: 'Fall protection requires competent person oversight',
  applicability: [
    'Installation and dismantling of fall protection systems',
    'Inspection of fall protection equipment',
    'Training of workers on fall hazards',
    'Monitoring work conditions for safety compliance'
  ],
  defenseNote: 'OSHA requires a competent person for fall protection oversight per 29 CFR 1926.32(f). This trained individual must be on-site for steep/high roof projects and cannot perform production work while monitoring safety. Superintendent/supervisor hours reflect this mandatory requirement.'
}

// ============================================
// LADDER AND ACCESS SAFETY
// ============================================

export const LADDER_SAFETY: OSHARequirement[] = [
  {
    standard: '1926.1053(b)(1)',
    title: 'Ladder Load Capacity',
    requirement: 'Ladders shall be capable of supporting the expected loads. Each step or rung shall be capable of supporting a single concentrated load of at least 250 pounds applied in the middle of the step or rung.',
    applicableSituations: [
      'All ladder access to roof',
      'Material carrying via ladder',
      'Multiple workers using same ladder'
    ],
    xactimateImpact: ['Equipment charges', 'Additional ladder setup'],
    defenseNote: 'OSHA 1926.1053(b)(1) requires properly rated ladders for construction work. Heavy-duty ladders capable of supporting workers with material loads are required equipment costs.'
  },
  {
    standard: '1926.1053(b)(4)',
    title: 'Ladder Extension Above Landing',
    requirement: 'Ladders used to access upper landing surfaces shall extend at least 3 feet above the upper landing surface.',
    applicableSituations: [
      'All roof access via ladder',
      'Every residential roofing project'
    ],
    xactimateImpact: ['Proper ladder equipment', 'Setup time'],
    defenseNote: 'OSHA requires ladders extend 3 feet above roof edge for safe access per 1926.1053(b)(4). Proper ladder setup is a safety compliance requirement.'
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determine if fall protection is required based on height
 */
export function requiresFallProtection(heightInFeet: number): boolean {
  return heightInFeet >= 6
}

/**
 * Determine if roof is steep per OSHA definitions
 */
export function isSteepRoof(pitch: number): boolean {
  return pitch > 4 // Greater than 4/12
}

/**
 * Get applicable OSHA requirements for a project
 */
export function getApplicableOSHARequirements(options: {
  pitch: number
  stories: number
  heightFeet: number
}): OSHARequirement[] {
  const applicable: OSHARequirement[] = []
  
  if (options.heightFeet >= 6) {
    if (options.pitch > 4) {
      applicable.push(OSHA_FALL_PROTECTION[1]) // Steep roofs
      applicable.push(OSHA_FALL_PROTECTION[2]) // Personal fall arrest
    } else {
      applicable.push(OSHA_FALL_PROTECTION[0]) // Low-slope roofs
    }
    applicable.push(OSHA_FALL_PROTECTION[5]) // Training
  }
  
  if (options.stories >= 2 || options.pitch >= 7) {
    applicable.push(OSHA_FALL_PROTECTION[4]) // Safety monitoring
  }
  
  return applicable
}

/**
 * Get safety charges applicable to a project
 */
export function getApplicableSafetyCharges(options: {
  pitch: number
  stories: number
}): SafetyCharge[] {
  const charges: SafetyCharge[] = []
  
  // Steep charges
  if (options.pitch >= 7 && options.pitch <= 9) {
    charges.push(SAFETY_CHARGES[0]) // RFGSTEEP
  } else if (options.pitch >= 10 && options.pitch <= 12) {
    charges.push(SAFETY_CHARGES[1]) // RFGSTEEP+
  } else if (options.pitch > 12) {
    charges.push(SAFETY_CHARGES[2]) // RFGSTEEP++
  }
  
  // High charge
  if (options.stories >= 2) {
    charges.push(SAFETY_CHARGES[3]) // RFGHIGH+
  }
  
  // Supervisor required for steep or high
  if (options.pitch > 5 || options.stories >= 2) {
    charges.push(SAFETY_CHARGES[4]) // RFGSUPR
  }
  
  return charges
}

/**
 * Generate OSHA defense note for safety charges
 */
export function getOSHADefenseNote(chargeCode: string): string | null {
  const charge = SAFETY_CHARGES.find(c => c.code === chargeCode)
  return charge?.defenseNote || null
}
