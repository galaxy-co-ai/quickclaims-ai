/**
 * Build Day Photo Checklist
 * 50+ standardized items for comprehensive roofing documentation
 */

export interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  required: boolean
  tips?: string[]
  xactimateRelevant?: string[]
}

export interface ChecklistCategory {
  id: string
  name: string
  icon: string
  description: string
  items: ChecklistItem[]
}

export const PHOTO_CHECKLIST: ChecklistCategory[] = [
  {
    id: 'pre_build',
    name: 'Pre-Build Documentation',
    icon: '📋',
    description: 'Document existing conditions before work begins',
    items: [
      {
        id: 'pb_overview_front',
        category: 'pre_build',
        title: 'Front Elevation Overview',
        description: 'Full view of home showing front roof slopes',
        required: true,
        tips: ['Stand back far enough to capture entire structure', 'Include address visible if possible'],
      },
      {
        id: 'pb_overview_rear',
        category: 'pre_build',
        title: 'Rear Elevation Overview',
        description: 'Full view of home showing rear roof slopes',
        required: true,
      },
      {
        id: 'pb_overview_left',
        category: 'pre_build',
        title: 'Left Side Elevation',
        description: 'Full side view from left when facing front',
        required: true,
      },
      {
        id: 'pb_overview_right',
        category: 'pre_build',
        title: 'Right Side Elevation',
        description: 'Full side view from right when facing front',
        required: true,
      },
      {
        id: 'pb_existing_damage',
        category: 'pre_build',
        title: 'Existing Damage Close-ups',
        description: 'Close-up shots of visible storm damage',
        required: true,
        tips: ['Show hail hits on shingles', 'Capture cracked/missing shingles'],
        xactimateRelevant: ['RFG300', 'RFGDMG'],
      },
      {
        id: 'pb_gutter_condition',
        category: 'pre_build',
        title: 'Gutter Condition',
        description: 'Document existing gutter damage or condition',
        required: false,
        xactimateRelevant: ['GTRALUM', 'GTRDOWN'],
      },
      {
        id: 'pb_yard_access',
        category: 'pre_build',
        title: 'Yard & Access Points',
        description: 'Document access areas for material staging',
        required: false,
      },
    ],
  },
  {
    id: 'tear_off',
    name: 'Tear-Off Documentation',
    icon: '🔨',
    description: 'Document removal of existing materials',
    items: [
      {
        id: 'to_crew_start',
        category: 'tear_off',
        title: 'Crew Starting Work',
        description: 'Photo of crew beginning tear-off',
        required: false,
      },
      {
        id: 'to_old_shingles',
        category: 'tear_off',
        title: 'Old Shingles Being Removed',
        description: 'Show shingle removal in progress',
        required: true,
        xactimateRelevant: ['RFGDEM'],
      },
      {
        id: 'to_deck_exposed',
        category: 'tear_off',
        title: 'Decking Exposed',
        description: 'Show bare deck after shingles removed',
        required: true,
        tips: ['Show overall deck condition', 'Capture any rot or damage'],
        xactimateRelevant: ['RFGDECK'],
      },
      {
        id: 'to_deck_damage',
        category: 'tear_off',
        title: 'Decking Damage (if any)',
        description: 'Close-up of any rotted or damaged decking',
        required: false,
        xactimateRelevant: ['RFGDECK', 'PLWD'],
      },
      {
        id: 'to_debris_contained',
        category: 'tear_off',
        title: 'Debris Containment',
        description: 'Show tarps/containment protecting property',
        required: false,
      },
      {
        id: 'to_old_flashing',
        category: 'tear_off',
        title: 'Old Flashing Removal',
        description: 'Document removal of old flashings',
        required: true,
        xactimateRelevant: ['RFGSTEP', 'RFGFLS'],
      },
    ],
  },
  {
    id: 'decking',
    name: 'Decking & Repairs',
    icon: '🪵',
    description: 'Document deck repairs and replacements',
    items: [
      {
        id: 'dk_replacement',
        category: 'decking',
        title: 'Decking Replacement',
        description: 'New plywood/OSB being installed',
        required: false,
        tips: ['Show size of replaced area', 'Include measuring tape if possible'],
        xactimateRelevant: ['PLWD', 'RFGDECK'],
      },
      {
        id: 'dk_fascia_repair',
        category: 'decking',
        title: 'Fascia Board Repair',
        description: 'Document fascia replacement or repair',
        required: false,
        xactimateRelevant: ['WDFAS'],
      },
      {
        id: 'dk_soffit_work',
        category: 'decking',
        title: 'Soffit Work',
        description: 'Document soffit repairs or replacement',
        required: false,
        xactimateRelevant: ['ALUSOF', 'VYLSOF'],
      },
    ],
  },
  {
    id: 'underlayment',
    name: 'Underlayment Installation',
    icon: '📜',
    description: 'Document underlayment and ice/water shield',
    items: [
      {
        id: 'ul_felt_install',
        category: 'underlayment',
        title: 'Synthetic Underlayment',
        description: 'Show underlayment being rolled out',
        required: true,
        tips: ['Show brand/type if visible', 'Capture proper overlap'],
        xactimateRelevant: ['RFGFELT', 'RFGSYN'],
      },
      {
        id: 'ul_iws_eaves',
        category: 'underlayment',
        title: 'Ice & Water Shield at Eaves',
        description: 'I&W shield at roof edge (IRC R905.2.8.5)',
        required: true,
        tips: ['Show 24" minimum coverage', 'Document brand if possible'],
        xactimateRelevant: ['RFGIWS'],
      },
      {
        id: 'ul_iws_valleys',
        category: 'underlayment',
        title: 'Ice & Water Shield in Valleys',
        description: 'I&W shield in roof valleys',
        required: true,
        tips: ['Show 36" minimum width'],
        xactimateRelevant: ['RFGIWS'],
      },
      {
        id: 'ul_iws_penetrations',
        category: 'underlayment',
        title: 'I&W at Penetrations',
        description: 'I&W shield around pipes, vents, skylights',
        required: true,
        xactimateRelevant: ['RFGIWS'],
      },
      {
        id: 'ul_full_deck',
        category: 'underlayment',
        title: 'Full Deck Coverage',
        description: 'Overview showing complete underlayment',
        required: true,
      },
    ],
  },
  {
    id: 'metal_work',
    name: 'Metal Work & Flashing',
    icon: '🔧',
    description: 'Document all metal components',
    items: [
      {
        id: 'mt_drip_edge',
        category: 'metal_work',
        title: 'Drip Edge Installation',
        description: 'New drip edge at eaves and rakes',
        required: true,
        tips: ['Show color match', 'Capture overlap at corners'],
        xactimateRelevant: ['RFGDRIP'],
      },
      {
        id: 'mt_step_flashing',
        category: 'metal_work',
        title: 'Step Flashing at Walls',
        description: 'Step flashing where roof meets wall',
        required: true,
        tips: ['Show weave pattern with shingles'],
        xactimateRelevant: ['RFGSTEP'],
      },
      {
        id: 'mt_valley_metal',
        category: 'metal_work',
        title: 'Valley Metal',
        description: 'Metal valley installation',
        required: false,
        xactimateRelevant: ['RFGVLY'],
      },
      {
        id: 'mt_headwall_flashing',
        category: 'metal_work',
        title: 'Headwall Flashing',
        description: 'Flashing at headwall transitions',
        required: true,
        xactimateRelevant: ['RFGFLS'],
      },
      {
        id: 'mt_chimney_flashing',
        category: 'metal_work',
        title: 'Chimney Flashing',
        description: 'Complete chimney flashing system',
        required: false,
        tips: ['Show step, counter, and cricket if applicable'],
        xactimateRelevant: ['RFGCRKT', 'RFGSTEP'],
      },
      {
        id: 'mt_skylight_flashing',
        category: 'metal_work',
        title: 'Skylight Flashing',
        description: 'Flashing around skylights',
        required: false,
        xactimateRelevant: ['RFGFLS'],
      },
      {
        id: 'mt_pipe_boots',
        category: 'metal_work',
        title: 'Pipe Boot Installation',
        description: 'New pipe boots/jacks',
        required: true,
        tips: ['Show proper seal around pipe'],
        xactimateRelevant: ['RFGBOOT'],
      },
    ],
  },
  {
    id: 'shingles',
    name: 'Shingle Installation',
    icon: '🏠',
    description: 'Document shingle installation',
    items: [
      {
        id: 'sh_starter_course',
        category: 'shingles',
        title: 'Starter Course',
        description: 'Starter strip at eaves',
        required: true,
        tips: ['Show proper overhang (3/8" - 3/4")'],
        xactimateRelevant: ['RFGSTRT'],
      },
      {
        id: 'sh_field_progress',
        category: 'shingles',
        title: 'Field Shingle Progress',
        description: 'Shingles being installed on roof field',
        required: true,
        xactimateRelevant: ['RFG300', 'RFG350'],
      },
      {
        id: 'sh_nailing_pattern',
        category: 'shingles',
        title: 'Nail Line / Pattern',
        description: 'Close-up showing proper nail placement',
        required: false,
        tips: ['Show 4-6 nails per shingle', 'Document high-wind nailing if applicable'],
      },
      {
        id: 'sh_hip_install',
        category: 'shingles',
        title: 'Hip Installation',
        description: 'Hip cap shingle installation',
        required: true,
        xactimateRelevant: ['RFGHIP'],
      },
      {
        id: 'sh_ridge_cap',
        category: 'shingles',
        title: 'Ridge Cap Installation',
        description: 'Ridge cap shingles being installed',
        required: true,
        xactimateRelevant: ['RFGRIDGCS'],
      },
      {
        id: 'sh_ridge_vent',
        category: 'shingles',
        title: 'Ridge Vent',
        description: 'Ridge vent installation',
        required: false,
        tips: ['Show vent opening cut', 'Capture vent over opening'],
        xactimateRelevant: ['RFGRIDGV'],
      },
    ],
  },
  {
    id: 'ventilation',
    name: 'Ventilation',
    icon: '💨',
    description: 'Document attic ventilation components',
    items: [
      {
        id: 'vt_intake_vents',
        category: 'ventilation',
        title: 'Intake Vents',
        description: 'Soffit vents or other intake',
        required: false,
        xactimateRelevant: ['RFGATV'],
      },
      {
        id: 'vt_exhaust_vents',
        category: 'ventilation',
        title: 'Exhaust Vents',
        description: 'Box vents, turbines, or power vents',
        required: false,
        xactimateRelevant: ['RFGATV', 'RFGPWRV'],
      },
      {
        id: 'vt_calculations',
        category: 'ventilation',
        title: 'Ventilation Layout',
        description: 'Overview showing vent placement',
        required: false,
        tips: ['Document NFA calculations if possible'],
      },
    ],
  },
  {
    id: 'completion',
    name: 'Completion Photos',
    icon: '✅',
    description: 'Final documentation after work complete',
    items: [
      {
        id: 'cp_front_complete',
        category: 'completion',
        title: 'Front Elevation Complete',
        description: 'Same angle as pre-build front photo',
        required: true,
      },
      {
        id: 'cp_rear_complete',
        category: 'completion',
        title: 'Rear Elevation Complete',
        description: 'Same angle as pre-build rear photo',
        required: true,
      },
      {
        id: 'cp_left_complete',
        category: 'completion',
        title: 'Left Side Complete',
        description: 'Same angle as pre-build left photo',
        required: true,
      },
      {
        id: 'cp_right_complete',
        category: 'completion',
        title: 'Right Side Complete',
        description: 'Same angle as pre-build right photo',
        required: true,
      },
      {
        id: 'cp_roof_plane_front',
        category: 'completion',
        title: 'Roof Plane - Front',
        description: 'Finished front roof planes',
        required: true,
      },
      {
        id: 'cp_roof_plane_rear',
        category: 'completion',
        title: 'Roof Plane - Rear',
        description: 'Finished rear roof planes',
        required: true,
      },
      {
        id: 'cp_valleys_done',
        category: 'completion',
        title: 'Valleys Complete',
        description: 'Finished valley work',
        required: true,
      },
      {
        id: 'cp_ridge_done',
        category: 'completion',
        title: 'Ridge Complete',
        description: 'Finished ridge cap',
        required: true,
      },
      {
        id: 'cp_cleanup',
        category: 'completion',
        title: 'Site Cleanup',
        description: 'Yard cleanup after debris removal',
        required: true,
        tips: ['Show clean yard', 'Document magnet sweep'],
      },
      {
        id: 'cp_material_labels',
        category: 'completion',
        title: 'Material Labels/Bundles',
        description: 'Shingle wrappers showing brand/color',
        required: true,
        tips: ['Keep for warranty documentation'],
      },
    ],
  },
]

/**
 * Get all checklist items flattened
 */
export function getAllChecklistItems(): ChecklistItem[] {
  return PHOTO_CHECKLIST.flatMap(cat => cat.items)
}

/**
 * Get required items only
 */
export function getRequiredItems(): ChecklistItem[] {
  return getAllChecklistItems().filter(item => item.required)
}

/**
 * Get items by category
 */
export function getItemsByCategory(categoryId: string): ChecklistItem[] {
  const category = PHOTO_CHECKLIST.find(cat => cat.id === categoryId)
  return category?.items || []
}

/**
 * Calculate completion percentage
 */
export function calculateCompletion(
  completedIds: string[],
  requiredOnly: boolean = false
): { completed: number; total: number; percentage: number } {
  const items = requiredOnly ? getRequiredItems() : getAllChecklistItems()
  const total = items.length
  const completed = completedIds.filter(id => 
    items.some(item => item.id === id)
  ).length
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

/**
 * Get next incomplete items
 */
export function getNextIncompleteItems(
  completedIds: string[],
  limit: number = 3
): ChecklistItem[] {
  const items = getAllChecklistItems()
  return items
    .filter(item => !completedIds.includes(item.id))
    .slice(0, limit)
}
