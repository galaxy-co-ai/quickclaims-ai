import { z } from 'zod'
import OpenAI from 'openai'
import { COMMONLY_MISSED_ITEMS, getXactimateCode } from './xactimate-codes'

// Photo types for roofing claims
export const PHOTO_TYPES = [
  'ground',      // Ground-level overview shots
  'edge',        // Eaves, rake, drip edge close-ups
  'rooftop',     // Roof surface, shingles
  'component',   // Vents, pipes, flashing, valleys
  'attic',       // Attic/interior ceiling
  'damage',      // Damage documentation
  'measurement', // Photos with measurements visible
] as const

export type PhotoType = typeof PHOTO_TYPES[number]

// Components to detect in roofing photos
export const ROOFING_COMPONENTS = [
  'shingles',
  'drip_edge',
  'starter_course', 
  'ridge_cap',
  'hip_cap',
  'valley',
  'ice_water_shield',
  'felt_underlayment',
  'synthetic_underlayment',
  'step_flashing',
  'counter_flashing',
  'chimney_flashing',
  'pipe_boot',
  'ridge_vent',
  'box_vent',
  'turbine_vent',
  'power_vent',
  'soffit_vent',
  'gutter',
  'downspout',
  'fascia',
  'soffit',
  'skylight',
  'satellite_dish',
] as const

export type RoofingComponent = typeof ROOFING_COMPONENTS[number]

// Damage types
export const DAMAGE_TYPES = [
  'hail',
  'wind',
  'missing_shingles',
  'lifted_shingles',
  'cracked_shingles',
  'granule_loss',
  'exposed_nail',
  'deterioration',
  'improper_installation',
  'moss_algae',
  'ponding_water',
  'puncture',
] as const

export type DamageType = typeof DAMAGE_TYPES[number]

// Schema for detected component
export const DetectedComponentSchema = z.object({
  component: z.string(),
  confidence: z.number().min(0).max(1),
  present: z.boolean(),
  condition: z.enum(['good', 'fair', 'poor', 'damaged', 'missing']).optional(),
  notes: z.string().optional(),
  estimatedQuantity: z.number().optional(),
  unit: z.string().optional(),
})

export type DetectedComponent = z.infer<typeof DetectedComponentSchema>

// Schema for detected damage
export const DetectedDamageSchema = z.object({
  damageType: z.string(),
  severity: z.enum(['minor', 'moderate', 'severe']),
  location: z.string().optional(),
  description: z.string(),
  affectedArea: z.string().optional(),
})

export type DetectedDamage = z.infer<typeof DetectedDamageSchema>

// Schema for full photo analysis result
export const PhotoAnalysisResultSchema = z.object({
  photoType: z.string(),
  location: z.string().optional(),
  components: z.array(DetectedComponentSchema),
  damage: z.array(DetectedDamageSchema),
  measurements: z.array(z.object({
    item: z.string(),
    value: z.number(),
    unit: z.string(),
    confidence: z.number().min(0).max(1),
  })).optional(),
  notes: z.string().optional(),
  supplementRecommendations: z.array(z.string()).optional(),
})

export type PhotoAnalysisResult = z.infer<typeof PhotoAnalysisResultSchema>

/**
 * Analyze a photo using GPT-4 Vision
 */
export async function analyzePhoto(
  imageUrl: string,
  photoType: PhotoType,
  existingScopeItems?: string[]
): Promise<PhotoAnalysisResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const systemPrompt = `You are an expert roofing insurance claims analyst. Analyze this roofing photo and identify:

1. COMPONENTS PRESENT: List all visible roofing components (shingles, drip edge, flashing, vents, gutters, etc.)
2. DAMAGE: Identify any visible damage (hail, wind, missing shingles, lifted shingles, etc.)
3. CONDITION: Note the overall condition of components
4. MEASUREMENTS: If any measurements are visible or can be estimated

For each component, indicate:
- Whether it's present
- Its condition (good, fair, poor, damaged, missing)
- Any notes about installation quality or issues

Focus especially on commonly missed items in carrier scopes:
- Drip edge at eaves and rakes (required per IRC R905.2.8.5)
- Starter course (required per IRC R904.1)
- Ice & water shield in valleys (required per IRC R905.2.8.2)
- Step flashing at roof-to-wall intersections (IRC R905.2.8.3)
- Hip/ridge cap shingles

${existingScopeItems?.length ? `
The carrier scope currently includes these items:
${existingScopeItems.join('\n')}

Look for items that may be MISSING from this scope.
` : ''}

Respond in JSON format matching this structure:
{
  "photoType": "ground|edge|rooftop|component|attic|damage|measurement",
  "location": "description of photo location (e.g., 'Front elevation', 'North side')",
  "components": [
    {
      "component": "component name",
      "confidence": 0.0-1.0,
      "present": true/false,
      "condition": "good|fair|poor|damaged|missing",
      "notes": "any relevant notes",
      "estimatedQuantity": number if estimable,
      "unit": "SQ|LF|EA|SF"
    }
  ],
  "damage": [
    {
      "damageType": "hail|wind|missing_shingles|etc",
      "severity": "minor|moderate|severe",
      "location": "where on roof",
      "description": "detailed description",
      "affectedArea": "estimated affected area"
    }
  ],
  "measurements": [
    {
      "item": "what was measured",
      "value": number,
      "unit": "LF|SF|SQ|inches",
      "confidence": 0.0-1.0
    }
  ],
  "notes": "overall observations",
  "supplementRecommendations": ["items that should be supplemented based on this photo"]
}`

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'high' }
          },
          {
            type: 'text',
            text: `This is a ${photoType} photo from a roofing insurance claim. Please analyze it thoroughly.`
          }
        ]
      }
    ],
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from GPT-4 Vision')
  }

  const parsed = JSON.parse(content)
  return PhotoAnalysisResultSchema.parse(parsed)
}

/**
 * Delta types for supplement recommendations
 */
export const DELTA_TYPES = {
  MISSING: 'missing',           // Item completely missing from scope
  UNDERSCOPED: 'underscoped',   // Quantity too low
  INCORRECT_CODE: 'incorrect_code', // Wrong Xactimate code
  INCORRECT_QTY: 'incorrect_qty',   // Quantity incorrect
  RECOMMEND_ADD: 'recommend_add',   // Should add based on code requirements
} as const

export type DeltaType = typeof DELTA_TYPES[keyof typeof DELTA_TYPES]

export const DELTA_STATUS = {
  IDENTIFIED: 'identified',
  APPROVED: 'approved',
  DENIED: 'denied',
  INCLUDED: 'included',
} as const

export type DeltaStatus = typeof DELTA_STATUS[keyof typeof DELTA_STATUS]

// Schema for delta item
export const DeltaItemSchema = z.object({
  deltaType: z.enum(['missing', 'underscoped', 'incorrect_code', 'incorrect_qty', 'recommend_add']),
  xactimateCode: z.string().optional(),
  description: z.string(),
  category: z.string().optional(),
  ircCode: z.string().optional(),
  defenseNote: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  estimatedRCV: z.number().optional(),
  evidenceNotes: z.string().optional(),
  photoAnalysisId: z.string().optional(),
})

export type DeltaItemInput = z.infer<typeof DeltaItemSchema>

/**
 * Analyze scope vs photos and generate delta list
 */
export async function generateDeltas(
  scopeLineItems: Array<{
    xactimateCode: string | null
    description: string
    quantity: number
    unit: string
    category: string
  }>,
  photoAnalyses: PhotoAnalysisResult[]
): Promise<DeltaItemInput[]> {
  const deltas: DeltaItemInput[] = []

  // Extract codes and descriptions from scope
  const scopeCodes = new Set(scopeLineItems.map(i => i.xactimateCode?.toUpperCase()).filter(Boolean))
  const scopeDescriptions = scopeLineItems.map(i => i.description.toLowerCase())

  // Check for commonly missed items
  for (const missed of COMMONLY_MISSED_ITEMS) {
    const hasCode = scopeCodes.has(missed.code.toUpperCase())
    const hasDescription = scopeDescriptions.some(d => 
      d.includes(missed.name.toLowerCase()) ||
      d.includes(missed.code.toLowerCase())
    )

    if (!hasCode && !hasDescription) {
      // Check if photo analysis detected this component
      const photoEvidence = photoAnalyses.find(pa =>
        pa.components.some(c => 
          c.component.toLowerCase().includes(missed.name.toLowerCase()) && c.present
        )
      )

      deltas.push({
        deltaType: 'missing',
        xactimateCode: missed.code,
        description: `${missed.name} - ${missed.reason}`,
        category: 'roofing',
        ircCode: missed.ircCode || undefined,
        defenseNote: missed.ircCode 
          ? `Per IRC ${missed.ircCode}, ${missed.name.toLowerCase()} is required. ${missed.reason}.`
          : `${missed.reason}. This is a standard requirement for proper roof installation.`,
        evidenceNotes: photoEvidence 
          ? `Component visible in photo analysis - confirmed present on roof.`
          : undefined,
      })
    }
  }

  // Check photo analyses for components that should be scoped
  for (const analysis of photoAnalyses) {
    // Check for damaged components
    for (const damage of analysis.damage) {
      if (damage.severity === 'severe' || damage.severity === 'moderate') {
        deltas.push({
          deltaType: 'recommend_add',
          description: `${damage.description} (${damage.severity} damage)`,
          category: 'roofing',
          evidenceNotes: `Damage identified in ${analysis.photoType} photo at ${analysis.location || 'unspecified location'}: ${damage.description}`,
        })
      }
    }

    // Add supplement recommendations from photo analysis
    if (analysis.supplementRecommendations) {
      for (const rec of analysis.supplementRecommendations) {
        // Avoid duplicates
        if (!deltas.some(d => d.description.toLowerCase().includes(rec.toLowerCase()))) {
          deltas.push({
            deltaType: 'recommend_add',
            description: rec,
            category: 'roofing',
            evidenceNotes: `Recommended based on ${analysis.photoType} photo analysis`,
          })
        }
      }
    }
  }

  // Remove duplicates
  const uniqueDeltas = deltas.filter((delta, index, self) =>
    index === self.findIndex(d => 
      d.xactimateCode === delta.xactimateCode && 
      d.description === delta.description
    )
  )

  return uniqueDeltas
}

/**
 * Generate a defense note for a delta item with IRC code reference
 */
export function generateDefenseNote(delta: DeltaItemInput): string {
  const code = delta.xactimateCode ? getXactimateCode(delta.xactimateCode) : null
  
  let note = ''
  
  if (delta.ircCode) {
    note += `Per IRC ${delta.ircCode}, `
  }
  
  if (code) {
    note += `${code.description} (${code.code}) is required. `
    if (code.ircCode) {
      note += `This is mandated by ${code.ircCode}. `
    }
    if (code.notes) {
      note += code.notes
    }
  } else {
    note += delta.description
  }
  
  if (delta.evidenceNotes) {
    note += ` Photo evidence: ${delta.evidenceNotes}`
  }
  
  return note.trim()
}
